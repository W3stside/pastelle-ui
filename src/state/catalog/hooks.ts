import { useQuery } from '@apollo/client'
import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'state'
import { batchUpdateCatalogByYear, ProductPageMap, updateCatalog } from './reducer'
import { useOnScreenProductHandle } from 'state/user/hooks'
import { GetCollectionQuery, GetCollectionQueryVariables } from 'shopify/graphql/types'
import { QUERY_GET_COLLECTION } from 'shopify/graphql/queries/collections'
import { mapShopifyProductToProps } from 'shopify/utils'
import { ProductPageProps, CatalogMap } from 'pages/SingleItem/AsideWithVideo'

export function useCatalog() {
  return useAppSelector(state => state.catalog)
}

export function useCatalogByDrop(drop: 'current' | number) {
  return useAppSelector(state => state.catalog[drop.toString()])
}

export function useCurrentCatalog() {
  return useCatalogByDrop('current')
}

export function useUpdateCatalog() {
  const dispatch = useAppDispatch()
  return useCallback((catalog: ProductPageMap) => dispatch(updateCatalog({ drop: 'current', catalog })), [dispatch])
}

export function useBatchUpdateCatalogByDrop() {
  const dispatch = useAppDispatch()
  return useCallback(
    (params: { drop: 'current' | number; catalog: ProductPageMap }) => dispatch(batchUpdateCatalogByYear(params)),
    [dispatch]
  )
}

export function useParseCatalogDetailsFromURL(): [string, string[]] {
  const { pathname } = useLocation()

  return useMemo(
    () => [
      pathname,
      pathname
        .substring(1)
        .split('/')
        .slice(1)
    ],
    [pathname]
  )
}

export const DEFAULT_CURRENT_COLLECTION_VARIABLES = {
  collectionAmount: 1,
  productAmt: 10,
  imageAmt: 20
}

export function useQueryCollections(variables: GetCollectionQueryVariables) {
  return useQuery<GetCollectionQuery, GetCollectionQueryVariables>(QUERY_GET_COLLECTION, {
    variables
  })
}

export function useQueryCurrentCatalog(variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES) {
  const { data, error } = useQueryCollections(variables)

  if (error) {
    console.error('Error fetching current catalog using variables:' + variables, 'Error:', error)
  }

  // collection
  const collection = data?.collections?.nodes[0]
  // products from collection mapped = catalog
  const catalogProductList = mapShopifyProductToProps(collection?.products.nodes)
  // { [PRODUCT_HANDLE]: PRODUCT }
  const catalogProductMap = catalogProductList.reduce((acc, product: ProductPageProps) => {
    acc[product.handle] = product

    return acc
  }, {} as CatalogMap)

  return { catalogProductMap, catalogProductList }
}

export function useQueryCurrentCatalogProductsFromUrl(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  // we need to use the URL to determine what item we're currently viewing
  const [pathname, [productName]] = useParseCatalogDetailsFromURL()

  const { catalogProductMap, catalogProductList } = useQueryCurrentCatalog(variables)

  const urlItem = catalogProductMap[productName]
  const currentCatalogProduct = urlItem || catalogProductList[0]

  return {
    catalogProductList,
    currentCatalogProduct,
    pathname
  }
}

export function useGetCurrentCatalogProductsFromUrl() {
  // we need to use the URL to determine what item we're currently viewing
  const [pathname, [productHandle]] = useParseCatalogDetailsFromURL()
  const currentCatalogMap = useCurrentCatalog()

  const currentCatalogProduct = currentCatalogMap?.[productHandle]

  if (!currentCatalogProduct) return null

  const catalogProductList: ProductPageProps[] = Object.values(currentCatalogProduct)

  return {
    catalogProductList,
    currentCatalogProduct,
    pathname
  }
}

export function useGetCurrentOnScreenCatalogProduct() {
  const catalog = useCurrentCatalog()
  const item = useOnScreenProductHandle()

  return item ? catalog?.[item.handle] : undefined
}

export function useQueryCurrentOnScreenCatalogProduct(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  const { catalogProductMap } = useQueryCurrentCatalog(variables)
  const item = useOnScreenProductHandle()

  return item ? catalogProductMap[item.handle] : undefined
}
