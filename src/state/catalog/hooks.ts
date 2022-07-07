import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { batchUpdateCatalogByYear, updateCatalog } from './reducer'
import { CatalogSeason, CatalogSeasonItemMap, CatalogSeasonsMap } from 'mock/types'
import { useOnScreenItemID } from 'state/user/hooks'
import { DEFAULT_CURRENT_COLLECTION_VARIABLES, useCurrentCollectionProducts } from 'pages/Catalog/hooks'
import { GetCollectionQueryVariables } from 'shopify/graphql/types'

export function useCatalog() {
  return useAppSelector(state => state.catalog)
}

export function useCatalogByYear(year: string | number) {
  return useAppSelector(state => state.catalog[year])
}

type CatalogByYearAndSeasonParams = {
  year: string | number
  season: CatalogSeason
}

export function useCatalogByYearAndSeason({ year, season }: CatalogByYearAndSeasonParams) {
  return useAppSelector(state => state.catalog[year][season])
}

export function useUpdateCatalog() {
  const dispatch = useAppDispatch()
  return useCallback(
    (params: { year: string | number; season: CatalogSeason; catalog: CatalogSeasonItemMap }) =>
      dispatch(updateCatalog(params)),
    [dispatch]
  )
}

export function useBatchUpdateCatalogByYear() {
  const dispatch = useAppDispatch()
  return useCallback(
    (params: { year: string | number; catalog: CatalogSeasonsMap }) => dispatch(batchUpdateCatalogByYear(params)),
    [dispatch]
  )
}

export function useGetCurrentOnScreenItem(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  const { productsMap } = useCurrentCollectionProducts(variables)
  const itemId = useOnScreenItemID()

  return itemId ? productsMap?.[itemId] : undefined
}
