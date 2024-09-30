import { BaseProductPageProps } from '@/components/pages-common/types'
import { sendEvent } from './base'
import { Category } from './types'
import { mapShopifyProductVariantToGA } from '@/shopify/utils'

export function sendProductViewEvent(product?: BaseProductPageProps | null) {
  if (!product) return

  const [, mappedProduct] = mapShopifyProductVariantToGA(product, 1, Category.ECOMMERCE) || []
  sendEvent('product_view', {
    eventCategory: Category.ECOMMERCE,
    eventAction: 'Product Viewed',
    productName: product.handle, // Name of the product
    productId: product.id, // ID of the product
    productPrice: product.priceRange.minVariantPrice.amount, // Product price (optional),
    currency: product.priceRange.minVariantPrice.currencyCode,
    value: product.priceRange.minVariantPrice.amount,
    items: [mappedProduct],
  })
}
