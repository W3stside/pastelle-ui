import { useIsSmallMediaWidth } from '@past3lle/hooks'
import { isMobile } from '@past3lle/utils'
import { ShowcaseVideosProps } from 'components/Showcase/Videos'
import { BaseProductPageProps } from 'pages/common/types'
import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Product } from 'shopify/graphql/types'
import { reduceShopifyMediaToShowcaseVideos } from 'shopify/utils'
import { useAppDispatch, useAppSelector } from 'state'
import { useGetShowcaseSettings } from 'state/user/hooks'

import {
  CollectionProductMap,
  ProductCurrentlyViewing,
  ProductPageMap,
  updateCollections,
  updateCurrentCollection,
  updateCurrentlyViewing,
  updateLoadingState,
  updateSingleProductInCollection,
} from './reducer'

export function useUpdateCurrentlyViewing() {
  const dispatch = useAppDispatch()

  return useCallback((params: ProductCurrentlyViewing) => dispatch(updateCurrentlyViewing(params)), [dispatch])
}

export const useOnScreenProductHandle = () => useAppSelector(({ collection }) => collection.currentlyViewing)
export function useUpdateCurrentlyViewingProduct(
  isActive: boolean | undefined,
  product?: Pick<Product, 'handle' | 'id'> | null
) {
  const updateCurrentlyViewing = useUpdateCurrentlyViewing()
  useEffect(() => {
    if (isActive && product) {
      updateCurrentlyViewing(product)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, product?.handle, product?.id, updateCurrentlyViewing])
}

export function useUpdateCurrentlyViewingCollection(
  isActive: boolean | undefined,
  collection?: Pick<CollectionProductMap, 'title' | 'id'> | null
) {
  const updateCurrentCollection = useUpdateCurrentCollection()
  useEffect(() => {
    if (isActive && collection) {
      updateCurrentCollection(collection.id, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, collection?.id, updateCurrentCollection])
}

export function useCollection() {
  return useAppSelector((state) => state.collection)
}

export function useIsCollectionLoading() {
  return useAppSelector((state) => state.collection.loading)
}

export function useCurrentCollection() {
  const { collections, current } = useCollection()

  const currentCollection = current?.id ? collections?.[current.id] : null

  return currentCollection
    ? { collection: currentCollection, title: currentCollection.title }
    : { collection: undefined, title: undefined }
}

export function useDeriveCurrentCollection() {
  const collectionFromUrl = useGetCurrentCollectionFromUrl()
  const { collection: currentCollection } = useCurrentCollection()
  const { collections, latest } = useCollection()
  return currentCollection || collectionFromUrl || (latest && collections[latest]) || null
}

export function useDeriveCurrentCollectionId() {
  return useDeriveCurrentCollection()?.id
}

export function useUpdateCurrentCollection() {
  const dispatch = useAppDispatch()
  return useCallback(
    (id: string | undefined, loading: boolean) => dispatch(updateCurrentCollection({ id, loading })),
    [dispatch]
  )
}

export function useUpdateCollections() {
  const dispatch = useAppDispatch()
  return useCallback(
    (collections: CollectionProductMap[], loading: boolean) => dispatch(updateCollections({ collections, loading })),
    [dispatch]
  )
}

export function useUpdateSingleProductInCollection() {
  const dispatch = useAppDispatch()
  return useCallback(
    (product: ProductPageMap[string], id: string) => dispatch(updateSingleProductInCollection({ product, id })),
    [dispatch]
  )
}

export function useUpdateCollectionLoadingStatus() {
  const dispatch = useAppDispatch()
  return useCallback((loading: boolean) => dispatch(updateLoadingState(loading)), [dispatch])
}

export function useGetCurrentCollectionFromUrl() {
  // we need to use the URL to determine what item we're currently viewing
  const { collection: id } = useParams()
  return useAppSelector((state) => (id ? state.collection.collections[id] : undefined))
}

export function useGetCurrentCollectionProductsFromUrl() {
  // we need to use the URL to determine what item we're currently viewing
  const { handle } = useParams()
  const { collection } = useCurrentCollection()

  const currentCollectionProduct = collection && handle ? collection.products[handle] : undefined
  if (!currentCollectionProduct) return null

  const collectionProductList: BaseProductPageProps[] = Object.values(currentCollectionProduct)

  return {
    collectionProductList,
    currentCollectionProduct,
    handle,
  }
}

export function useGetCurrentOnScreenCollectionProduct() {
  const { collection } = useCurrentCollection()
  const item = useOnScreenProductHandle()

  return item ? collection?.products[item.handle] : undefined
}

export function useCurrentProductMedia() {
  const currentItem = useGetCurrentOnScreenCollectionProduct()

  return useMemo(
    () => ({
      bgColor: currentItem?.bgColor,
      color: currentItem?.color,
      headerLogoSet: currentItem?.headerLogo,
      logoSet: currentItem?.logo,
      navLogoSet: currentItem?.navLogo,
    }),
    [currentItem]
  )
}

export function useGetAllProductLogos() {
  const { collection } = useCurrentCollection()
  if (!collection) return null

  return Object.values(collection.products).map(({ headerLogo, navLogo, logo }) => ({ headerLogo, navLogo, logo }))
}

export function useGetProductShowcaseVideos({ videos }: Pick<ShowcaseVideosProps, 'videos'>) {
  const { gender, height, size: selectedSize } = useGetShowcaseSettings()

  return useMemo(
    () => ({
      videoMap: videos.reduce(reduceShopifyMediaToShowcaseVideos, {}),
      webKey: `${gender}-${height}-${selectedSize}`,
      get mobileKey() {
        return this.webKey + '-MOBILE'
      },
    }),
    [gender, height, selectedSize, videos]
  )
}

export function useGetSelectedProductShowcaseVideo(props: Pick<ShowcaseVideosProps, 'videos'>) {
  const { videoMap, mobileKey, webKey } = useGetProductShowcaseVideos(props)
  const isMobileWidth = useIsSmallMediaWidth()

  return useMemo(
    () => videoMap[isMobileWidth || isMobile ? mobileKey : webKey] || videoMap[webKey],
    [mobileKey, videoMap, webKey, isMobileWidth]
  )
}
