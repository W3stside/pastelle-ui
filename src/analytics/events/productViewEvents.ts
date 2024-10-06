import { BaseProductPageProps } from '@/components/PagesComponents/types'
import { gtag } from './base'
import { Category } from './types'
import { mapShopifyProductVariantToGA } from '@/shopify/utils'

export function sendProductViewEvent(product?: BaseProductPageProps | null) {
  if (!product) return

  const [, mappedProduct] = mapShopifyProductVariantToGA(product, 1, Category.ECOMMERCE) || []
  gtag('event', 'view_item', {
    value: product.priceRange.minVariantPrice.amount,
    currency: product.priceRange.minVariantPrice.currencyCode,
    items: [mappedProduct],
  })
}
