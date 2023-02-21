import { Product } from 'shopify/graphql/types'

import { Category, sendEvent } from '../index'

export function addToCartAnalytics(item: Product['handle']) {
  sendEvent({
    category: Category.CART,
    action: 'ADD TO CART',
    label: item,
  })
}

export function removeFromCartAnalytics(item: Product['handle']) {
  sendEvent({
    category: Category.CART,
    action: 'REMOVE FROM CART',
    label: item,
  })
}
