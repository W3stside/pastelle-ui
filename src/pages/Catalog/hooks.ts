import useSWR from 'swr'
import { useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { CatalogItem, CatalogSeason, CatalogSeasonItemMap } from 'mock/apparel/types'
import { delay } from 'utils'

import MOCK_CATALOG_MAP from 'mock/apparel'
import { BASE_CATALOG_URL } from '.'
import { useCatalog } from 'state/catalog/hooks'

type URLFromCatalogItemsParams = {
  seasonList: CatalogItem[]
  currentItem: CatalogItem | undefined
  isActive: boolean
  itemKey: string
  itemIndex: number
}

export function useUpdateURLFromCatalogItem(params: URLFromCatalogItemsParams) {
  const { seasonList, currentItem, isActive, itemKey, itemIndex } = params
  const { replace } = useHistory()
  // update url
  useEffect(() => {
    const urlNeedsUpdate = isActive && currentItem?.itemHeader !== itemKey

    if (urlNeedsUpdate) {
      const currentItemKey = seasonList[itemIndex]?.key
      if (!currentItemKey) return

      replace(BASE_CATALOG_URL + currentItemKey.split('-')[0])
    }
  }, [currentItem?.itemHeader, isActive, itemKey, itemIndex, replace, seasonList])
}

export function useCatalogItemFromURL() {
  // we need to use the URL to determine what item we're currently viewing
  const { pathname } = useLocation()
  const [year = '', season = '', item = ''] = useMemo(
    () =>
      pathname
        .substring(1)
        .split('/')
        .slice(1),
    [pathname]
  )

  // mock hook for async fetching of catalog data
  const catalogMap = useCatalog()

  const seasonMap = catalogMap?.[year.toUpperCase()]?.[season.toUpperCase() as CatalogSeason]
  const seasonList = Object.values(seasonMap || {})
  const currentItem = seasonMap?.[item.toUpperCase()]

  return {
    seasonList,
    currentItem,
    pathname
  }
}

type FetchCatalogDataProps = {
  year: number | string
  season: CatalogSeason
}

export function useMockFetchCatalogData(params: FetchCatalogDataProps) {
  const { season, year } = params

  return useSWR<CatalogSeasonItemMap>(
    ['catalog', season, year],
    () => (year && season ? delay(2300, MOCK_CATALOG_MAP.get(year.toString())?.[season]) : {}),
    {
      refreshInterval: 20000
    }
  )
}

export function useMockFetchCatalogDataByYear(year: number) {
  return {
    WINTER: useMockFetchCatalogData({ year, season: 'WINTER' }),
    SPRING: useMockFetchCatalogData({ year, season: 'SPRING' }),
    SUMMER: useMockFetchCatalogData({ year, season: 'SUMMER' }),
    FALL: useMockFetchCatalogData({ year, season: 'FALL' })
  }
}
