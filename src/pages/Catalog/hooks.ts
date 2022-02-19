import useSWR from 'swr'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { CatalogItemsMap, CatalogSeason } from 'mock/apparel/types'
import { delay } from 'utils'

import MOCK_CATALOG_MAP from 'mock/apparel'

export function useCatalogItemFromURL(catalogMap?: CatalogItemsMap) {
  // we need to use the URL to determine what item we're currently viewing
  const { pathname } = useLocation()
  const [year, season, item] = useMemo(
    () =>
      pathname
        .substring(1)
        .split('/')
        .slice(1),
    [pathname]
  )

  const seasonMap = catalogMap?.[year.toUpperCase()]?.[season.toUpperCase() as CatalogSeason]
  const seasonList = Object.values(seasonMap || {})
  const currentItem = seasonMap?.[item.toUpperCase()]

  return {
    seasonList,
    currentItem
  }
}

type FetchCatalogDataProps = {
  year: number | string
  season: CatalogSeason
}

export function useMockGetCatalogData(params: FetchCatalogDataProps) {
  console.debug('MOCK::fetching mock catalog data', params)
  const { season, year } = params

  return useSWR<CatalogItemsMap>(
    ['catalog', season, year],
    () => (season && year ? delay(2300, MOCK_CATALOG_MAP) : {}),
    {
      refreshInterval: 20000
    }
  )
}
