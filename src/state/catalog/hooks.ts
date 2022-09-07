import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { batchUpdateCatalogByYear, ProductPageMap, updateCatalog } from './reducer'
import { useOnScreenProductHandle } from 'state/user/hooks'
import { DEFAULT_CURRENT_COLLECTION_VARIABLES, useCurrentCollectionProducts } from 'pages/Catalog/hooks'
import { GetCollectionQueryVariables } from 'shopify/graphql/types'

export function useCatalog() {
  return useAppSelector(state => state.catalog)
}

export function useCatalogByYear(year: string | number) {
  return useAppSelector(state => state.catalog[year])
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

export function useGetCurrentOnScreenItem(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  const { productsMap } = useCurrentCollectionProducts(variables)
  const item = useOnScreenProductHandle()

  return item ? productsMap[item.handle] : undefined
}
