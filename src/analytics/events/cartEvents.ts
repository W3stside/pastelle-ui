import { apolloClient } from 'shopify/graphql/ApolloProvider'
import { GET_CART } from 'shopify/graphql/queries/cart'
import { FragmentCartLineFragment, GetCartQuery, ProductVariantQuery } from 'shopify/graphql/types'
import { CartState } from 'state/cart/reducer'

import { Category, sendEvent } from '../index'

export function addToCartAnalytics(item: ProductVariantQuery['product'], quantity: number) {
  const mappedData = _mapShopifyProductToGA4(item, quantity, {
    category: Category.CART,
    label: `${item?.variantBySelectedOptions?.product?.handle} added to cart`,
  })
  if (!mappedData) return

  sendEvent('add_to_cart', mappedData)
}

export function removeFromCartAnalytics(item: FragmentCartLineFragment['merchandise']) {
  const mappedData = _mapShopifyProductToGA4(item, 1, {
    category: Category.CART,
    label: `${item?.product.handle} removed from cart`,
  })

  if (!mappedData) return

  sendEvent('remove_from_cart', mappedData)
}

export async function viewCartAnalytics(cart: CartState) {
  apolloClient
    .query<GetCartQuery>({
      query: GET_CART,
      variables: {
        cartId: cart.cartId,
        linesAmount: 50,
      },
    })
    .then(({ data, error }) => {
      if (error) {
        console.error('[viewCartAnalytics]::Error occurred in sending viewCart analytics:', error)
        throw new Error(error?.message)
      }

      const params = {
        category: Category.APPAREL,
        currency: data?.cart?.cost.totalAmount.currencyCode,
        value: parseFloat(data?.cart?.cost.totalAmount.amount) || 'N/A',
      }

      const mappedData = data.cart?.lines.nodes.map((node, index) =>
        _shopifyCartLineToGA(node, node.quantity, Category.APPAREL, index)
      )

      mappedData &&
        sendEvent('view_cart', {
          ...params,
          items: mappedData,
        })
    })
    .catch((error) => {
      console.error(error)
    })
}

function _mapShopifyProductToGA4(
  item: ProductVariantQuery['product'] | FragmentCartLineFragment['merchandise'],
  quantity: number,
  params: { category: string; label: string }
) {
  const data = _shopifyProductVariantToGA(item, quantity, Category.APPAREL)
  if (!data) return

  const [product, productTagData] = data
  return {
    ...params,
    currency: product.priceV2.currencyCode,
    value: parseFloat(product.priceV2.amount) || 'N/A',
    items: [productTagData],
  }
}

function _shopifyProductVariantToGA(
  item: ProductVariantQuery['product'] | FragmentCartLineFragment['merchandise'],
  quantity: number,
  category: Category
) {
  const product =
    (item as ProductVariantQuery['product'])?.variantBySelectedOptions ||
    (item as FragmentCartLineFragment['merchandise'])

  if (!product) return null

  return [
    product,
    {
      item_sku: product?.sku,
      item_id: product.id,
      item_name: product?.product?.handle,
      item_brand: 'PASTELLE APPAREL',
      item_category: category,
      price: parseFloat(product?.priceV2.amount),
      item_variant: product?.selectedOptions.map((options: any) => options.name + '-' + options.value).join(', '),
      item_category_2: product?.product?.tags?.[0],
      item_category_3: product?.product?.tags?.[1],
      item_category_4: product?.product?.tags?.[2],
      item_category_5: product?.product?.tags?.[3],
      quantity,
    },
  ] as const
}

function _shopifyCartLineToGA(cartLine: FragmentCartLineFragment, quantity: number, category: Category, index: number) {
  const merchandise = cartLine?.merchandise
  if (!merchandise?.product) return null

  return {
    index,
    item_id: merchandise.sku,
    item_name: merchandise.product.title,
    item_brand: 'PASTELLE APPAREL',
    item_variant: `${merchandise.size}`,
    item_category: category,
    item_category_2: merchandise.product.tags?.[0],
    item_category_3: merchandise.product.tags?.[1],
    item_category_4: merchandise.product.tags?.[2],
    item_category_5: merchandise.product.tags?.[3],
    price: parseFloat(cartLine?.merchandise?.priceV2?.amount) || 'N/A',
    quantity,
  } as const
}
