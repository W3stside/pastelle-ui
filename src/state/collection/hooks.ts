import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import {
  batchUpdateCollectionByYear,
  ProductPageMap,
  updateCollection,
  ProductCurrentlyViewing,
  updateCurrentlyViewing
} from './reducer'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import { useParams } from 'react-router-dom'

export function useUpdateCurrentlyViewing() {
  const dispatch = useAppDispatch()

  return useCallback((params: ProductCurrentlyViewing) => dispatch(updateCurrentlyViewing(params)), [dispatch])
}

export const useOnScreenProductHandle = () => useAppSelector(({ collection }) => collection.currentlyViewing)

export function useCollection() {
  return useAppSelector(state => state.collection)
}

export function useCollectionByDrop(drop?: string | number) {
  return useAppSelector(state => (drop ? state.collection[drop.toString()] : null))
}

export function useCurrentCollection() {
  return useCollectionByDrop('currentDrop')
}

export function useUpdateCollection() {
  const dispatch = useAppDispatch()
  return useCallback((collection: ProductPageMap) => dispatch(updateCollection({ drop: 'currentDrop', collection })), [
    dispatch
  ])
}

export function useBatchUpdateCollectionByDrop() {
  const dispatch = useAppDispatch()
  return useCallback(
    (params: { drop: 'currentDrop' | number; collection: ProductPageMap }) =>
      dispatch(batchUpdateCollectionByYear(params)),
    [dispatch]
  )
}

export function useGetCurrentCollectionProductsFromUrl() {
  // we need to use the URL to determine what item we're currently viewing
  const { handle } = useParams()
  const currentCollectionMap = useCurrentCollection()

  const currentCollectionProduct = handle ? currentCollectionMap?.[handle] : undefined
  if (!currentCollectionProduct) return null

  const collectionProductList: ProductPageProps[] = Object.values(currentCollectionProduct)

  return {
    collectionProductList,
    currentCollectionProduct,
    handle
  }
}

export function useGetCurrentOnScreenCollectionProduct() {
  const collection = useCurrentCollection()
  const item = useOnScreenProductHandle()

  return item ? collection?.[item.handle] : undefined
}
