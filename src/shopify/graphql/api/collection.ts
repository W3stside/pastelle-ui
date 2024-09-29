import { apolloClient } from '../ApolloClient'
import { formatCollectionsResponse } from '../hooks'
import { QUERY_GET_COLLECTION } from '../queries/collections'
import { GetCollectionQuery, GetCollectionQueryVariables } from '../types'

export async function formattedCollectionQuery(variables: GetCollectionQueryVariables) {
  const response = await apolloClient.query<GetCollectionQuery, GetCollectionQueryVariables>({
    query: QUERY_GET_COLLECTION,
    variables,
  })
  if (!response.data || response.error) throw new Error('Failed getting collection data!')
  const collections = formatCollectionsResponse(response)

  return collections
}
