import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import {
  batchUpdateCatalogByYear,
  ProductPageMap,
  updateCatalog,
  ProductCurrentlyViewing,
  updateCurrentlyViewing
} from './reducer'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import { useParams } from 'react-router-dom'

export function useUpdateCurrentlyViewing() {
  const dispatch = useAppDispatch()

  return useCallback((params: ProductCurrentlyViewing) => dispatch(updateCurrentlyViewing(params)), [dispatch])
}

export const useOnScreenProductHandle = () => useAppSelector(({ catalog }) => catalog.currentlyViewing)

export function useCatalog() {
  return useAppSelector(state => state.catalog)
}

export function useCatalogByDrop(drop?: string | number) {
  return useAppSelector(state => (drop ? state.catalog[drop.toString()] : null))
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

export function useGetCurrentCatalogProductsFromUrl() {
  // we need to use the URL to determine what item we're currently viewing
  const { handle } = useParams()
  const currentCatalogMap = useCurrentCatalog()

  const currentCatalogProduct = handle ? currentCatalogMap?.[handle] : undefined
  if (!currentCatalogProduct) return null

  const catalogProductList: ProductPageProps[] = Object.values(currentCatalogProduct)

  return {
    catalogProductList,
    currentCatalogProduct,
    handle
  }
}

export function useGetCurrentOnScreenCatalogProduct() {
  const catalog = useCurrentCatalog()
  const item = useOnScreenProductHandle()

  return item ? catalog?.[item.handle] : undefined
}
