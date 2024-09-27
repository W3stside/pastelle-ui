import { ApolloError, ApolloQueryResult, useQuery as useRealQuery } from '@apollo/client'
import { getLockStatus } from '@past3lle/forge-web3'
import { devError } from '@past3lle/utils'
import { PRODUCT_AMOUNT, PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from '@/constants/config'
import { BaseProductPageProps, CollectionMap } from '@/components/pages-common/types'
import { QUERY_GET_COLLECTION } from '@/shopify/graphql/queries/collections'
import {
  GetCartQuery,
  GetCartQueryVariables,
  GetCollectionQuery,
  GetCollectionQueryVariables,
  HomePageQuery,
  PoliciesQuery,
  ProductByIdQuery,
  ProductByIdQueryVariables,
  ProductVariantQuery,
  ProductVariantQueryVariables,
} from '@/shopify/graphql/types'
import { getMetafields, mapShopifyHomepageToProps, mapShopifyProductToProps } from '@/shopify/utils'
import { useOnScreenProductHandle } from '@/state/collection/hooks'
import { MOCK_ENABLED } from '@/constants/flags'

import { GET_CART } from '../queries/cart'
import { QUERY_POLICIES } from '../queries/policies'
import { QUERY_HOMEPAGE, QUERY_PRODUCT_BY_ID, QUERY_PRODUCT_VARIANT_BY_KEY_VALUE } from '../queries/products'
// MOCKS
import { useMockQuery } from './mock/hooks'
import { MOCK_COLLECTION_DATA } from './mock/queries'
import { useSearchParams } from 'next/navigation'

const useQuery: typeof useRealQuery = MOCK_ENABLED ? (useMockQuery as typeof useRealQuery) : useRealQuery

export const DEFAULT_CURRENT_COLLECTION_VARIABLES = {
  collectionAmount: 1,
  productAmt: PRODUCT_AMOUNT,
  imageAmt: PRODUCT_IMAGES_AMOUNT,
  videoAmt: PRODUCT_VIDEOS_AMOUNT,
}

function useRealQueryCollections(variables: GetCollectionQueryVariables) {
  return useQuery<GetCollectionQuery, GetCollectionQueryVariables>(QUERY_GET_COLLECTION, {
    variables,
    skip: !variables.productAmt,
  })
}

function useMockQueryCollection(_variables: GetCollectionQueryVariables, mockOptions?: { error?: Error }) {
  return {
    data: MOCK_COLLECTION_DATA,
    error: mockOptions?.error,
    loading: false,
  }
}

export const useQueryRawCollections: typeof useRealQueryCollections = MOCK_ENABLED
  ? (useMockQueryCollection as unknown as typeof useRealQueryCollections)
  : useRealQueryCollections

export interface CollectionResponseFormatted {
  title: string
  id: string
  locked: boolean
  collectionProductMap: CollectionMap
  collectionProductList: BaseProductPageProps[]
  loading: boolean
}

export function formatCollectionsResponse(
  response:
    | ReturnType<typeof useQueryRawCollections>
    | (ApolloQueryResult<GetCollectionQuery> & { variables?: GetCollectionQueryVariables })
): CollectionResponseFormatted[] {
  const { data, error, loading, variables } = response

  if (error) {
    devError('Error fetching current collection using variables:' + JSON.stringify(variables, null, 2), 'Error:', error)
  }

  // collections
  const collections = data?.collections?.nodes || []

  return collections.map((collection) => {
    // products from collection mapped = collection
    const collectionProductList = mapShopifyProductToProps(collection?.products.nodes)
    // { [PRODUCT_HANDLE]: PRODUCT }
    const collectionProductMap = collectionProductList.reduce((acc, product: BaseProductPageProps) => {
      const lockStatus = getLockStatus(product.skillMetadata)
      acc[product.handle] = { ...product, lockStatus }

      return acc
    }, {} as CollectionMap)
    const title = collection?.title || 'current'
    const id = collection?.id
    const locked = !!getMetafields<boolean | null>(collection?.lockStatus)

    return { title, id, locked, collectionProductMap, collectionProductList, loading }
  })
}

export function useQueryCollections(variables: GetCollectionQueryVariables) {
  'use server'
  const response = useQueryRawCollections(variables)

  return formatCollectionsResponse(response)
}

export function useQueryCurrentCollection(
  variables: Omit<GetCollectionQueryVariables, 'reverse' | 'collectionAmount'>
) {
  const response = useQueryRawCollections({ ...variables, collectionAmount: 1, reverse: true })

  return formatCollectionsResponse(response)?.[0]
}

export function useQueryCurrentCollectionProductsFromUrl(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  // we need to use the URL to determine what item we're currently viewing
  const searchParams = useSearchParams()
  const handle = searchParams?.get('handle')

  const { collectionProductMap, collectionProductList } = useQueryCurrentCollection(variables)

  const urlItem = handle ? collectionProductMap[handle] : null
  const currentCollectionProduct = urlItem || collectionProductList[0]

  return {
    collectionProductList,
    currentCollectionProduct,
    handle,
  }
}

export function useQueryCurrentOnScreenCollectionProduct(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  const { collectionProductMap } = useQueryCurrentCollection(variables)
  const item = useOnScreenProductHandle()

  return item ? collectionProductMap[item.handle] : undefined
}

export function useQueryHomepageRaw() {
  const { data, error } = useQuery<HomePageQuery>(QUERY_HOMEPAGE)

  if (error) {
    devError(error)
  }

  return data?.product
}

export function useQueryHomepage() {
  const homepageRaw = useQueryHomepageRaw()

  return homepageRaw ? mapShopifyHomepageToProps(homepageRaw) : null
}

export function useQueryProductVariantByKeyValue(
  variables: ProductVariantQueryVariables
): ProductVariantQuery['product'] | null | undefined {
  const { data, error } = useQuery<ProductVariantQuery, ProductVariantQueryVariables>(
    QUERY_PRODUCT_VARIANT_BY_KEY_VALUE,
    { variables }
  )
  if (error) {
    devError(error)
  }

  // return first
  return data?.product
}

export function useQueryCart(variables: GetCartQueryVariables) {
  const { data, loading, error } = useQuery<GetCartQuery, GetCartQueryVariables>(GET_CART, { variables })

  if (error) {
    devError(error)
  }

  return { data, loading, error }
}

type ProductVariantIdParams = ProductVariantQueryVariables
export function useQueryProductVariantId(params: ProductVariantIdParams) {
  return useQueryProductVariantByKeyValue(params)?.variantBySelectedOptions?.id
}

export function useQueryProductById(variables: ProductByIdQueryVariables): {
  data: ProductByIdQuery | undefined
  error: ApolloError | undefined
  loading: boolean
} {
  const { data, error, loading } = useQuery<ProductByIdQuery, ProductByIdQueryVariables>(QUERY_PRODUCT_BY_ID, {
    variables,
    // don't query if we can't get the id from URL
    skip: !variables.id,
  })
  if (error) {
    devError(error)
  }

  // return first
  return { data, error, loading }
}

export function useQueryProductByIdAndMap(variables: ProductByIdQueryVariables) {
  const { data: product, loading } = useQueryProductById(variables)

  // products from collection mapped = collection
  const data = product?.product ? mapShopifyProductToProps([product.product]) : null

  if (!data) return null

  // { [PRODUCT_HANDLE]: PRODUCT }
  const formattedProduct = { [data[0].handle]: data[0] } as CollectionMap
  const title = 'TRUNCATED'

  return { title, id: product?.product?.id, handle: product?.product?.handle, product: formattedProduct, loading }
}

export function useQueryPolicies() {
  const { data, error, loading } = useQuery<PoliciesQuery>(QUERY_POLICIES)

  if (error) {
    devError(error)
  }

  return { data, error, loading }
}
