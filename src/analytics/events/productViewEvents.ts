import { BaseProductPageProps } from '@/components/pages-common/types'
import { sendEvent } from './base'

export function sendProductViewEvent(product: BaseProductPageProps) {
  sendEvent('product_view', {
    productId: product.id, // ID of the product
    productName: product.handle, // Name of the product
    productPrice: product.priceRange.minVariantPrice.amount, // Product price (optional)
    eventCategory: 'Ecommerce',
    eventAction: 'Product Viewed',
  })
}
