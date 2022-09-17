import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { ProductPageMap, updateCollection, ProductCurrentlyViewing, updateCurrentlyViewing } from './reducer'
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

export function useCurrentCollection() {
  const collectionInfo = useCollection().current

  return collectionInfo || { collection: undefined, title: undefined }
}

export function useUpdateCollection() {
  const dispatch = useAppDispatch()
  return useCallback((title: string, collection: ProductPageMap) => dispatch(updateCollection({ title, collection })), [
    dispatch
  ])
}

export function useGetCurrentCollectionProductsFromUrl() {
  // we need to use the URL to determine what item we're currently viewing
  const { handle } = useParams()
  const { collection } = useCurrentCollection()

  const currentCollectionProduct = handle ? collection?.[handle] : undefined
  if (!currentCollectionProduct) return null

  const collectionProductList: ProductPageProps[] = Object.values(currentCollectionProduct)

  return {
    collectionProductList,
    currentCollectionProduct,
    handle
  }
}

export function useGetCurrentOnScreenCollectionProduct() {
  const { collection } = useCurrentCollection()
  const item = useOnScreenProductHandle()

  return item ? collection?.[item.handle] : undefined
}

export function useCurrentProductMedia() {
  const currentItem = useGetCurrentOnScreenCollectionProduct()

  return useMemo(
    () => ({
      bgColor: currentItem?.bgColor,
      color: currentItem?.color,
      headerLogo: currentItem?.headerLogo,
      logo: currentItem?.logo,
      navLogo: currentItem?.navLogo
    }),
    [currentItem]
  )
}
