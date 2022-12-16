import { setWidthLqTransforms } from 'pages/common/utils'

import ButtonCarousel from 'components/Carousel/common/components/ButtonCarousel'
import SmartImg, { SmartImageProps } from 'components/SmartImg'
import { BaseCarouselProps, CarouselChildrenProps, WithTouchAction } from './common/types'
import { FragmentProductVideoFragment, GenericImageSrcSet } from 'shopify/graphql/types'
import { isProductVideo } from 'shopify/utils'
import { CarouselShowcaseVideo } from './common/common'
import HorizontalSwipeCarousel from './HorizontalSwipeCarousel'
import { useCallback } from 'react'
import { LazyVideoProps } from 'components/LazyVideo'

interface ProductCarousel extends Omit<BaseCarouselProps, 'children'> {
  data: (GenericImageSrcSet | FragmentProductVideoFragment | undefined)[]
  imageProps?: Omit<SmartImageProps, 'path' | 'pathSrcSet' | 'transformation' | 'onClick'>
  videoProps?: LazyVideoProps['videoProps']
}
export type ProductClickCarousel = ProductCarousel & { showButtons: boolean }
export function ClickCarousel({ data, parentNode, imageProps, ...rest }: ProductClickCarousel) {
  const memoedCurriedFn = useCallback(() => curriedCarouselRenderFn({ data, imageProps, parentNode }), [
    data,
    imageProps,
    parentNode
  ])
  return (
    <ButtonCarousel {...rest} data={data}>
      {memoedCurriedFn()}
    </ButtonCarousel>
  )
}
export type ProductSwipeCarousel = ProductCarousel & WithTouchAction
export function SwipeCarousel({ data, parentNode, imageProps, videoProps, ...rest }: ProductSwipeCarousel) {
  const memoedCurriedFn = useCallback(() => curriedCarouselRenderFn({ data, imageProps, videoProps, parentNode }), [
    data,
    imageProps,
    parentNode,
    videoProps
  ])
  return (
    <HorizontalSwipeCarousel {...rest} data={data}>
      {memoedCurriedFn()}
    </HorizontalSwipeCarousel>
  )
}

const curriedCarouselRenderFn = ({
  data,
  parentNode,
  imageProps,
  videoProps
}: Pick<ProductCarousel, 'data' | 'parentNode' | 'imageProps' | 'videoProps'>) =>
  function CarouselRenderFn({ index, imageTransformations }: CarouselChildrenProps) {
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
          transformation={imageTransformations}
          lqImageOptions={{
            ...imageTransformations?.[0],
            ...setWidthLqTransforms(parentNode, { showLoading: true })
          }}
        />
      )
    } else {
      return null
    }
  }
