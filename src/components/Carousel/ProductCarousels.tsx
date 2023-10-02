import {
  BaseCarouselProps,
  ButtonCarousel,
  ButtonCarouselProps,
  CarouselChildrenProps,
  HorizontalSwipeCarousel,
  WithTouchAction,
} from '@past3lle/carousel'
import { SmartVideoProps as LazyVideoProps, SmartImageProps, SmartImg } from '@past3lle/components'
import { useIsMobile as useIsMobileDeviceOrWidth } from '@past3lle/hooks'
import { useCallback } from 'react'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
import { isProductVideo } from 'shopify/utils'
import { ShopImageSrcSet } from 'types'

import { CarouselShowcaseVideo } from './CarouselShowcaseVideo'

type CarouselData = ShopImageSrcSet | FragmentProductVideoFragment | undefined
type ProductCarousel = Omit<BaseCarouselProps<CarouselData[]>, 'children'> & {
  data: CarouselData[]
  imageProps?: Omit<SmartImageProps, 'path' | 'pathSrcSet' | 'onClick'>
  videoProps?: LazyVideoProps['videoProps']
}
export type ProductClickCarousel = ProductCarousel & Omit<ButtonCarouselProps<CarouselData[]>, 'children'>
export function ClickCarousel({ data, imageProps, ...rest }: ProductClickCarousel) {
  const isMobileDeviceOrWidth = useIsMobileDeviceOrWidth()

  const memoedCurriedFn = useCallback(
    () => curriedCarouselRenderFn({ data, imageProps, isMobileDeviceOrWidth }),
    [data, imageProps, isMobileDeviceOrWidth]
  )
  return (
    <ButtonCarousel {...rest} data={data}>
      {memoedCurriedFn()}
    </ButtonCarousel>
  )
}
export type ProductSwipeCarousel = ProductCarousel & WithTouchAction
export function SwipeCarousel({ data, imageProps, videoProps, ...rest }: ProductSwipeCarousel) {
  const memoedCurriedFn = useCallback(
    () => curriedCarouselRenderFn({ data, imageProps, videoProps, isMobileDeviceOrWidth: true }),
    [data, imageProps, videoProps]
  )
  return (
    <HorizontalSwipeCarousel {...rest} data={data}>
      {memoedCurriedFn()}
    </HorizontalSwipeCarousel>
  )
}

const curriedCarouselRenderFn = ({
  data,
  imageProps,
  videoProps,
  isMobileDeviceOrWidth,
}: Pick<ProductCarousel, 'data' | 'imageProps' | 'videoProps'> & {
  fillWidth?: boolean
  isMobileDeviceOrWidth?: boolean
}) =>
  function CarouselRenderFn({ index, defaultImageTransforms }: CarouselChildrenProps) {
    const item = data[index]

    if (item) {
      return isProductVideo(item) ? (
        <CarouselShowcaseVideo
          videoProps={videoProps}
          forceLoad={!!isMobileDeviceOrWidth}
          firstPaintOver
          selectedVideo={item}
          hideVideo={false}
          currentCarouselIndex={index}
          fallback={<h1>NO VIDEO AVAILABLE!</h1>}
          zIndex={1}
        />
      ) : (
        <SmartImg
          {...imageProps}
          path={{ defaultPath: item.defaultUrl }}
          pathSrcSet={item}
          transformation={[defaultImageTransforms, ...(imageProps?.transformation || [])]}
          lqImageOptions={{
            ...defaultImageTransforms,
            showLoadingIndicator: true,
          }}
        />
      )
    } else {
      return null
    }
  }
