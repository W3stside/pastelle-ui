import { apolloClient } from '../ApolloClient'
import { QUERY_HOMEPAGE } from '../queries/products'
import { HomePageQuery } from '../types'

export async function homeQuery() {
  const response = await apolloClient.query<HomePageQuery>({
    query: QUERY_HOMEPAGE,
  })
  if (!response.data || response.error) throw new Error('Failed getting home data!')

  return response.data
}
