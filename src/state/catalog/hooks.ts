import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'state'
import {
  batchUpdateCatalogByYear,
  ProductPageMap,
  updateCatalog,
  ProductCurrentlyViewing,
  updateCurrentlyViewing
} from './reducer'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'

export function useUpdateCurrentlyViewing() {
  const dispatch = useAppDispatch()

  return useCallback((params: ProductCurrentlyViewing) => dispatch(updateCurrentlyViewing(params)), [dispatch])
}

export const useOnScreenProductHandle = () => useAppSelector(({ catalog }) => catalog.currentlyViewing)

export function useCatalog() {
  return useAppSelector(state => state.catalog)
}

export function useCatalogByDrop(drop: 'currentDrop' | number) {
  return useAppSelector(state => state.catalog[drop.toString()])
}

export function useCurrentCatalog() {
  return useCatalogByDrop('currentDrop')
}

export function useUpdateCatalog() {
  const dispatch = useAppDispatch()
  return useCallback((catalog: ProductPageMap) => dispatch(updateCatalog({ drop: 'currentDrop', catalog })), [dispatch])
}

export function useBatchUpdateCatalogByDrop() {
  const dispatch = useAppDispatch()
  return useCallback(
    (params: { drop: 'currentDrop' | number; catalog: ProductPageMap }) => dispatch(batchUpdateCatalogByYear(params)),
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
