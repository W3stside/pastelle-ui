import { isMobile } from '@past3lle/utils'
import { ShowcaseVideosProps } from 'components/Showcase/Videos'
import { BaseProductPageProps } from 'pages/common/types'
import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Product } from 'shopify/graphql/types'
import { reduceShopifyMediaToShowcaseVideos } from 'shopify/utils'
import { useAppDispatch, useAppSelector } from 'state'
import { useGetShowcaseSettings } from 'state/user/hooks'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'

import { ProductCurrentlyViewing, ProductPageMap, updateCollection, updateCurrentlyViewing } from './reducer'

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

export function useCollection() {
  return useAppSelector((state) => state.collection)
}

export function useCurrentCollection() {
  const collectionInfo = useCollection().current

  return collectionInfo || { collection: undefined, title: undefined }
}

export function useUpdateCollection() {
  const dispatch = useAppDispatch()
  return useCallback(
    (title: string, collection: ProductPageMap) => dispatch(updateCollection({ title, collection })),
    [dispatch]
  )
}

export function useGetCurrentCollectionProductsFromUrl() {
  // we need to use the URL to determine what item we're currently viewing
  const { handle } = useParams()
  const { collection } = useCurrentCollection()

  const currentCollectionProduct = handle ? collection?.[handle] : undefined
  if (!currentCollectionProduct) return null

  const collectionProductList: BaseProductPageProps[] = Object.values(currentCollectionProduct)

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
      headerLogoSet: currentItem?.headerLogo,
      logoSet: currentItem?.logo,
      navLogoSet: currentItem?.navLogo
    }),
    [currentItem]
  )
}

export function useGetAllProductLogos() {
  const { collection } = useCurrentCollection()
  if (!collection) return null

  return Object.values(collection).map(({ headerLogo, navLogo, logo }) => ({ headerLogo, navLogo, logo }))
}

export function useGetProductShowcaseVideos({ videos }: Pick<ShowcaseVideosProps, 'videos'>) {
  const { gender, height, size: selectedSize } = useGetShowcaseSettings()

  return useMemo(
    () => ({
      videoMap: videos.reduce(reduceShopifyMediaToShowcaseVideos, {}),
      webKey: `${gender}-${height}-${selectedSize}`,
      get mobileKey() {
        return this.webKey + '-MOBILE'
      }
    }),
    [gender, height, selectedSize, videos]
  )
}

export function useGetSelectedProductShowcaseVideo(props: Pick<ShowcaseVideosProps, 'videos'>) {
  const { videoMap, mobileKey, webKey } = useGetProductShowcaseVideos(props)
  const isMobileWidth = useIsMobileWindowWidthSize()

  return useMemo(
    () => videoMap[isMobileWidth || isMobile ? mobileKey : webKey] || videoMap[webKey],
    [mobileKey, videoMap, webKey, isMobileWidth]
  )
}
