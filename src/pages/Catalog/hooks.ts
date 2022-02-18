import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { CatalogItemsMap, CatalogSeason } from 'mock/apparel/types'

export function useCatalogItemFromURL(catalogMap: CatalogItemsMap) {
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
  const itemData = catalogMap[year.toUpperCase()]?.[season.toUpperCase() as CatalogSeason]?.[item.toUpperCase()]

  return itemData
}
