import { apolloClient } from '../ApolloClient'
import { QUERY_PRODUCT, QUERY_PRODUCT_BY_ID } from '../queries/products'
import { ProductByIdQuery, ProductByIdQueryVariables, ProductQuery, ProductQueryVariables } from '../types'

export async function productsQuery(variables: ProductQueryVariables) {
  const response = await apolloClient.query<ProductQuery, ProductQueryVariables>({
    query: QUERY_PRODUCT,
    variables,
  })
  if (!response.data || response.error) throw new Error('Failed getting products data! Using variables:' + JSON.stringify(variables, null, 2))

  return response.data
}

export async function productByIdQuery(variables: ProductByIdQueryVariables) {
  const response = await apolloClient.query<ProductByIdQuery, ProductByIdQueryVariables>({
    query: QUERY_PRODUCT_BY_ID,
    variables,
  })

  if (!response.data || response.error) throw new Error('Failed getting specific product data! Using variables:' + JSON.stringify(variables, null, 2))

  return response.data
}