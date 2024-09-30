import { sendEvent } from './base'
import { PoliciesQuery } from '@/shopify/graphql/types'

export function sendPolicyViewEvent(
  policyName: string,
  policy: Omit<PoliciesQuery['shop'], '__typename'>[keyof Omit<PoliciesQuery['shop'], '__typename'>],
) {
  sendEvent('policy_view', {
    policyName: policyName, // ID of the product
    policyTitle: policy?.title, // Name of the product
    eventAction: 'Policy Viewed',
  })
}
