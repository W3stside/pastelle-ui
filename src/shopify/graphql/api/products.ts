import { apolloClient } from '../ApolloClient'
import { QUERY_PRODUCT, QUERY_PRODUCT_BY_ID, QUERY_PRODUCT_PATHS } from '../queries/products'
import {
  ProductByIdQuery,
  ProductByIdQueryVariables,
  ProductPathsQuery,
  ProductPathsQueryVariables,
  ProductQuery,
  ProductQueryVariables,
} from '../types'

export async function queryProducts(variables: ProductQueryVariables) {
  const response = await apolloClient.query<ProductQuery, ProductQueryVariables>({
    query: QUERY_PRODUCT,
    variables,
  })
  if (!response.data || response.error)
    throw new Error('Failed getting products data! Using variables:' + JSON.stringify(variables, null, 2))

  return response.data
}

export async function queryProductPaths(query: string) {
  const response = await apolloClient.query<ProductPathsQuery, ProductPathsQueryVariables>({
    query: QUERY_PRODUCT_PATHS,
    variables: {
      amount: 50,
      query,
    },
  })
  if (!response.data || response.error) throw new Error('Failed getting products paths data!')

  return response.data
}

export async function queryProductByHandle(variables: ProductByIdQueryVariables) {
  const response = await apolloClient.query<ProductByIdQuery, ProductByIdQueryVariables>({
    query: QUERY_PRODUCT_BY_ID,
    variables,
  })

  if (!response.data || response.error)
    throw new Error('Failed getting specific product data! Using variables:' + JSON.stringify(variables, null, 2))

  return response.data
}

export async function queryProductById(variables: ProductByIdQueryVariables) {
  const response = await apolloClient.query<ProductByIdQuery, ProductByIdQueryVariables>({
    query: QUERY_PRODUCT_BY_ID,
    variables,
  })

  if (!response.data || response.error)
    throw new Error('Failed getting specific product data! Using variables:' + JSON.stringify(variables, null, 2))

  return response.data
}
