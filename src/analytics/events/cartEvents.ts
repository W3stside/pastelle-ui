import { apolloClient } from '@/shopify/graphql/ApolloClient'
import { GET_CART } from '@/shopify/graphql/queries/cart'
import { FragmentCartLineFragment, GetCartQuery, ProductVariantQuery } from '@/shopify/graphql/types'
import { CartState } from '@/state/cart/reducer'

import { sendError, sendEvent } from './base'
import { Category } from './types'
import { mapShopifyProductVariantToGA } from '@/shopify/utils'

export function addToCartAnalytics(item: ProductVariantQuery['product'], quantity: number) {
  const mappedData = _mapShopifyProductToGA4(item, quantity, {
    eventCategory: Category.ECOMMERCE,
    label: `${item?.variantBySelectedOptions?.product?.handle} added to cart`,
  })
  if (!mappedData) return

  sendEvent('add_to_cart', mappedData)
}

export function removeFromCartAnalytics(item: FragmentCartLineFragment['merchandise']) {
  const mappedData = _mapShopifyProductToGA4(item, 1, {
    eventCategory: Category.ECOMMERCE,
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
        sendError(error, 'view_cart::apolloClient_query::GET_CART')
        throw new Error(error?.message)
      }

      const params = {
        eventCategory: Category.ECOMMERCE,
        currency: data?.cart?.cost.totalAmount.currencyCode,
        value: parseFloat(data?.cart?.cost.totalAmount.amount) || 'N/A',
      }

      const mappedData = data.cart?.lines.nodes.map((node, index) =>
        'merchandise' in node ? _shopifyCartLineToGA(node, node.quantity, Category.ECOMMERCE, index) : null,
      )

      if (mappedData) {
        sendEvent('view_cart', {
          ...params,
          items: mappedData,
        })
      }
    })
    .catch((error) => {
      console.error(error)
      sendError(error, 'view_cart::apolloClient_query::GET_CART')
    })
}

export async function goToCheckoutAnalytics(cart?: GetCartQuery['cart']) {
  const params = {
    eventCategory: Category.ECOMMERCE,
    currency: cart?.cost.totalAmount.currencyCode,
    value: parseFloat(cart?.cost.totalAmount.amount) || 'N/A',
  }

  const mappedData = cart?.lines.nodes.map((node, index) =>
    'merchandise' in node ? _shopifyCartLineToGA(node, node.quantity, Category.ECOMMERCE, index) : null,
  )

  sendEvent('begin_checkout', {
    ...params,
    items: mappedData || [],
  })
}

function _mapShopifyProductToGA4(
  item: ProductVariantQuery['product'] | FragmentCartLineFragment['merchandise'],
  quantity: number,
  params: { eventCategory: string; label: string },
) {
  const data = mapShopifyProductVariantToGA(item, quantity, Category.ECOMMERCE)
  if (!data) return

  const [product, productTagData] = data
  return {
    ...params,
    currency: product.priceV2.currencyCode,
    value: parseFloat(product?.priceV2?.amount) || 'N/A',
    items: [productTagData],
  }
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
