import { apolloClient } from '../ApolloClient'
import { QUERY_POLICIES } from '../queries/policies'
import { PoliciesQuery, PoliciesQueryVariables } from '../types'

export async function queryPolicies() {
  const response = await apolloClient.query<PoliciesQuery, PoliciesQueryVariables>({
    query: QUERY_POLICIES,
  })

  if (!response.data || response.error) throw new Error('Failed getting policies data!')

  return response.data
}
