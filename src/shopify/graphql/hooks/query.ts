import { useQuery as useRealQuery } from '@apollo/client'
import { mapShopifyProductToProps } from 'shopify/utils'
import { QUERY_GET_COLLECTION } from 'shopify/graphql/queries/collections'
import {
  GetCollectionQueryVariables,
  GetCollectionQuery,
  ProductVariantQuery,
  ProductVariantQueryVariables,
  GetCartQueryVariables,
  GetCartQuery
} from 'shopify/graphql/types'
import { ProductPageProps, CollectionMap } from 'pages/SingleItem/AsideWithVideo'
import { useOnScreenProductHandle } from 'state/collection/hooks'
import { QUERY_PRODUCT_VARIANT_BY_KEY_VALUE } from '../queries/products'
import { GET_CART } from '../queries/cart'
import { useParams } from 'react-router-dom'
// MOCKS
import { useMockQuery } from './mock/hooks'
import { MOCK_COLLECTION_DATA } from './mock/queries'

const isMock = process.env.REACT_APP_IS_MOCK === 'true'

const useQuery: typeof useRealQuery = isMock ? (useMockQuery as typeof useRealQuery) : useRealQuery

export const DEFAULT_CURRENT_COLLECTION_VARIABLES = {
  collectionAmount: 1,
  productAmt: 10,
  imageAmt: 20
}

function useRealQueryCollections(variables: GetCollectionQueryVariables) {
  return useQuery<GetCollectionQuery, GetCollectionQueryVariables>(QUERY_GET_COLLECTION, {
    variables
  })
}

function useMockQueryCollection(variables: GetCollectionQueryVariables, mockOptions?: { error?: Error }) {
  return {
    data: MOCK_COLLECTION_DATA,
    error: mockOptions?.error,
    loading: false
  }
}

export const useQueryCollections: typeof useRealQueryCollections = isMock
  ? ((useMockQueryCollection as unknown) as typeof useRealQueryCollections)
  : useRealQueryCollections

export function useQueryCurrentCollection(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  const { data, error } = useQueryCollections(variables)

  if (error) {
    console.error('Error fetching current collection using variables:' + variables, 'Error:', error)
  }

  // collection
  const collection = data?.collections?.nodes[0]

  // products from collection mapped = collection
  const collectionProductList = mapShopifyProductToProps(collection?.products.nodes)
  // { [PRODUCT_HANDLE]: PRODUCT }
  const collectionProductMap = collectionProductList.reduce((acc, product: ProductPageProps) => {
    acc[product.handle] = product

    return acc
  }, {} as CollectionMap)
  const title = collection?.title || 'current'

  return { title, collectionProductMap, collectionProductList }
}

export function useQueryCurrentCollectionProductsFromUrl(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  // we need to use the URL to determine what item we're currently viewing
  const { handle } = useParams()
  const { collectionProductMap, collectionProductList } = useQueryCurrentCollection(variables)

  const urlItem = handle ? collectionProductMap[handle] : null
  const currentCollectionProduct = urlItem || collectionProductList[0]

  return {
    collectionProductList,
    currentCollectionProduct,
    handle
  }
}

export function useQueryCurrentOnScreenCollectionProduct(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  const { collectionProductMap } = useQueryCurrentCollection(variables)
  const item = useOnScreenProductHandle()

  return item ? collectionProductMap[item.handle] : undefined
}

export function useQueryProductVariantByKeyValue(variables: ProductVariantQueryVariables) {
  const { data, error } = useQuery<ProductVariantQuery, ProductVariantQueryVariables>(
    QUERY_PRODUCT_VARIANT_BY_KEY_VALUE,
    { variables }
  )
  if (error) {
    console.error(error)
  }

  // return first
  return data?.product
}

export function useQueryCart(variables: GetCartQueryVariables) {
  const { data, loading, error } = useQuery<GetCartQuery, GetCartQueryVariables>(GET_CART, { variables })

  if (error) {
    console.error(error)
  }

  return { data, loading, error }
}

type ProductVariantIdParams = ProductVariantQueryVariables
export function useQueryProductVariantId(params: ProductVariantIdParams) {
  return useQueryProductVariantByKeyValue(params)?.variantBySelectedOptions?.id
}
