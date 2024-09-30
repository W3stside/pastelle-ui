import { useEffect } from 'react'
import { PoliciesQuery } from '@/shopify/graphql/types'
import { sendPolicyViewEvent } from '../events/policyViewEvents'

export function usePolicyViewReporter(
  name: string,
  policy: Omit<PoliciesQuery['shop'], '__typename'>[keyof Omit<PoliciesQuery['shop'], '__typename'>] | undefined | null,
) {
  useEffect(() => {
    if (policy) sendPolicyViewEvent(name, policy)
  }, [name, policy])
}
