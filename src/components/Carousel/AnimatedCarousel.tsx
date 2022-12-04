import { AnimatedDivContainer } from 'components/ScrollingContentPage/styleds'
import { STORE_IMAGE_SIZES } from 'constants/config'
import useHorizontalScrollingAnimation from 'hooks/useScrollingAnimation/useHorizontalScrollingAnimation'
import { useMemo } from 'react'
import { CarouselIndicators, CarouselStep } from './common'
import { useCarouselSetup } from './hooks'
import { CarouselContainer } from './styleds'
import { BaseCarouselProps } from './types'

export default function AnimatedCarousel({
  imageList,
  startIndex,
  fixedHeight,
  buttonColor,
  transformation,
  fullSizeContent,
  loadInViewOptions,
  onImageClick
}: BaseCarouselProps) {
  const { parentWidth, imageTransformations, setCarouselContainerRef } = useCarouselSetup({
    startIndex
  })

  const optimisedImageList = useMemo(() => (imageList.length === 2 ? imageList.concat(imageList) : imageList), [
    imageList
  ])

  const { currentIndex, itemSize, springs, setScrollingZoneRef, setItemSizeRef } = useHorizontalScrollingAnimation(
    optimisedImageList,
    {
      sizeOptions: {
        minSize: STORE_IMAGE_SIZES.SMALL
      },
      scaleOptions: { initialScale: 1 },
      snapOnScroll: true,
      visible: imageList.length - 1,
      config: ({ length, configPos }) => ({
        tension: (1 + length - configPos) * 140,
        friction: 1 + configPos * 40
        // clamp: true
      })
    }
  )

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={node => {
        setCarouselContainerRef(node)
        setScrollingZoneRef(node)
        setItemSizeRef(node)
      }}
      fixedHeight={fixedHeight || parentWidth + 'px'}
    >
      <CarouselIndicators
        size={imageList.length}
        currentIndex={
          optimisedImageList.length === imageList.length
            ? currentIndex
            : currentIndex % (optimisedImageList.length - imageList.length)
        }
        color={buttonColor}
      />
      {/* CAROUSEL CONTENT */}
      {springs.map(({ x }, index) => {
        const { defaultUrl, ...urlRest } = optimisedImageList[index]

        if (!parentWidth) return null

        return (
          <AnimatedDivContainer
            key={index}
            style={{ width: itemSize, x }}
            $borderRadius="0px"
            $withBoxShadow={false}
            $isVerticalScroll={false}
            $touchAction="none"
          >
            <CarouselStep
              index={index}
              parentWidth={parentWidth}
              buttonColor={buttonColor}
              onImageClick={onImageClick}
              // image props
              imageProps={{
                path: { defaultPath: defaultUrl },
                pathSrcSet: fullSizeContent ? undefined : urlRest,
                transformation: transformation || imageTransformations,
                loadInViewOptions,
                lqImageOptions: { ...imageTransformations[0], showLoadingIndicator: true }
              }}
              // flags
              showIndicators
              transformAmount={0}
              isMultipleCarousel={false}
              showButtons={false}
              // cbs
              onNext={null}
              onPrev={null}
            />
          </AnimatedDivContainer>
        )
      })}
    </CarouselContainer>
  )
}
