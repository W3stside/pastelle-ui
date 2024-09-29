import { BaseProductPageProps } from '@/components/pages-common/types'
import { sendGTMEvent } from '@next/third-parties/google'

export function sendProductViewEvent(product: BaseProductPageProps) {
  sendGTMEvent({
    event: 'product_view', // Custom event for product views
    productId: product.id, // ID of the product
    productName: product.handle, // Name of the product
    productPrice: product.priceRange.minVariantPrice.amount, // Product price (optional)
    eventCategory: 'Ecommerce',
    eventAction: 'Product Viewed',
  })
}
