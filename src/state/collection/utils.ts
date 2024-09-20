import { DEFAULT_CURRENT_COLLECTION_VARIABLES } from '@/shopify/graphql/hooks'
import { getShopifyId } from '@/shopify/utils'
import { PastelleReferrals, URLFlowType } from './types'

export function getFlowParams(searchParams: URLSearchParams) {
  const shopifyId = getShopifyId(searchParams.get('id'), 'Product')
  if (shopifyId && searchParams.get('referral') === PastelleReferrals.FORGE) {
    return {
      type: URLFlowType.SKILL,
      params: { id: shopifyId, amount: DEFAULT_CURRENT_COLLECTION_VARIABLES.productAmt },
    }
  } else {
    // normal flow, e.g collection view
    return {
      type: URLFlowType.COLLECTION,
      params: { amount: searchParams.get('skills') || DEFAULT_CURRENT_COLLECTION_VARIABLES.productAmt },
    }
  }
}
