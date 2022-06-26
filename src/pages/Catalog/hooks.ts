import { useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { CatalogItem } from 'mock/types'

import { CATALOG_URL } from 'constants/navigation'
// import { useCatalog } from 'state/catalog/hooks'
import { useQuery } from '@apollo/client'
import { QUERY_GET_COLLECTION } from 'shopify/graphql/queries/collections'
import { GetCollectionQuery, GetCollectionQueryVariables } from 'shopify/graphql/types'
import { mapShopifyProductToProps } from 'shopify/utils'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'

/* function _filterEmpty(item: any) {
  return !!item && Object.keys(item).length !== 0
} */

type URLFromCatalogItemsParams = {
  products: CatalogItem[]
  currentProduct: CatalogItem | undefined
  isActive: boolean
  id: string
  index: number
}

export function useUpdateURLFromCatalogItem(params: URLFromCatalogItemsParams) {
  const { products, currentProduct, isActive, id, index } = params
  const { replace } = useHistory()
  // update url
  useEffect(() => {
    const urlNeedsUpdate = isActive && currentProduct?.id !== id

    if (urlNeedsUpdate) {
      const currentItemKey = products[index]?.id
      if (!currentItemKey) return

      replace(CATALOG_URL + currentItemKey.split('-')[0])
    }
  }, [currentProduct?.id, isActive, id, index, replace, products])
}

export function useGetCatalogDetailsFromURL(): [string, string[]] {
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

export function useCollections(variables: GetCollectionQueryVariables) {
  return useQuery<GetCollectionQuery, GetCollectionQueryVariables>(QUERY_GET_COLLECTION, {
    variables
  })
}

export const DEFAULT_CURRENT_COLLECTION_VARIABLES = {
  collectionAmount: 1,
  productAmt: 10,
  imageAmt: 20
}

export function useCurrentCollectionProducts(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  // mock hook for async fetching of catalog data
  const { data, error } = useCollections(variables)

  if (error) {
    console.error(error)
  }

  // TODO: fix types
  // collection
  const collection = data?.collections?.nodes[0]
  const products = mapShopifyProductToProps(collection?.products.nodes)
  // TODO: fix types
  const productsMap = products.reduce((acc, prod: ProductPageProps) => {
    acc[prod.title] = prod

    return acc
  }, {} as Record<string, ProductPageProps>)

  return { productsMap, productsList: products }
}

export function useCurrentCollectionProductsFromUrl(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  // we need to use the URL to determine what item we're currently viewing
  const [pathname, [, , item = '']] = useGetCatalogDetailsFromURL()

  const { productsMap, productsList } = useCurrentCollectionProducts(variables)

  const urlItem = productsMap[item]
  const currentProduct = urlItem || productsList[0]

  return {
    products: productsList,
    currentProduct,
    pathname
  }
}
