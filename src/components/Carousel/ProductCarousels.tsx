import {
  BaseCarouselProps,
  ButtonCarousel,
  ButtonCarouselProps,
  CarouselChildrenProps,
  HorizontalSwipeCarousel,
  WithTouchAction,
} from '@past3lle/carousel'
import { SmartVideoProps as LazyVideoProps, SmartImageProps, SmartImg } from '@past3lle/components'
import { useCallback } from 'react'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
import { isProductVideo } from 'shopify/utils'
import { ShopImageSrcSet } from 'types'

import { CarouselShowcaseVideo } from './CarouselShowcaseVideo'

type CarouselData = ShopImageSrcSet | FragmentProductVideoFragment | undefined
interface ProductCarousel extends Omit<BaseCarouselProps<CarouselData[]>, 'children'> {
  data: CarouselData[]
  imageProps?: Omit<SmartImageProps, 'path' | 'pathSrcSet' | 'onClick'>
  videoProps?: LazyVideoProps['videoProps']
}
export type ProductClickCarousel = ProductCarousel & Omit<ButtonCarouselProps<CarouselData[]>, 'children'>
export function ClickCarousel({ data, imageProps, ...rest }: ProductClickCarousel) {
  const memoedCurriedFn = useCallback(() => curriedCarouselRenderFn({ data, imageProps }), [data, imageProps])
  return (
    <ButtonCarousel {...rest} data={data}>
      {memoedCurriedFn()}
    </ButtonCarousel>
  )
}
export type ProductSwipeCarousel = ProductCarousel & WithTouchAction
export function SwipeCarousel({ data, imageProps, videoProps, ...rest }: ProductSwipeCarousel) {
  const memoedCurriedFn = useCallback(
    () => curriedCarouselRenderFn({ data, imageProps, videoProps }),
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
}: Pick<ProductCarousel, 'data' | 'imageProps' | 'videoProps'> & {
  fillWidth?: boolean
}) =>
  function CarouselRenderFn({ index, defaultImageTransforms }: CarouselChildrenProps) {
    const item = data[index]

    if (item) {
      return isProductVideo(item) ? (
        <CarouselShowcaseVideo
          videoProps={videoProps}
          firstPaintOver
          selectedVideo={item}
          hideVideo={false}
          currentCarouselIndex={index}
          fallback={<h1>NO VIDEO AVAILABLE!</h1>}
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
