import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { batchUpdateCatalogByYear, updateCatalog } from './reducer'
import { CatalogSeason, CatalogSeasonItemMap, CatalogSeasonsMap } from 'mock/apparel/types'
import { useOnScreenItemID } from 'state/user/hooks'
import { CURRENT_YEAR, CURRENT_SEASON } from 'constants/config'

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

export function useGetCurrentOnScreenItem() {
  const catalog = useCatalogByYearAndSeason({ year: CURRENT_YEAR, season: CURRENT_SEASON })
  const itemId = useOnScreenItemID()

  return itemId ? catalog?.[itemId] : undefined
}
