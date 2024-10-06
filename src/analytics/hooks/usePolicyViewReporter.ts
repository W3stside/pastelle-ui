import { useEffect } from 'react'
import { PoliciesQuery } from '@/shopify/graphql/types'
import { sendPolicyViewEvent } from '../events/policyViewEvents'

export function usePolicyViewReporter(
  name: string,
  policy: Omit<PoliciesQuery['shop'], '__typename'>[keyof Omit<PoliciesQuery['shop'], '__typename'>] | undefined | null,
) {
  useEffect(() => {
    if (policy) sendPolicyViewEvent(name, policy)
    // Can safely ignore policy entirely as the body text is unique
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, policy?.body])
}
