import { AnimatedDivContainer } from 'components/ScrollingContentPage/styleds'
import { CarouselIndicators, CarouselStep } from './common'
import { useCarouselSetup } from './hooks'
import { CarouselContainer } from './styleds'
import { BaseCarouselProps } from './types'
import { useLimitedHorizontalSwipe } from 'hooks/useScrollAnimation'
import { STORE_IMAGE_SIZES } from 'constants/config'

export default function AnimatedCarousel({
  imageList,
  fixedSizes,
  buttonColor,
  transformation,
  fullSizeContent,
  loadInViewOptions,
  lqImageOptions,
  onImageClick
}: BaseCarouselProps) {
  const { parentWidth, imageTransformations, setCarouselContainerRef } = useCarouselSetup({
    fixedSizes
  })

  const {
    bind,
    springs,
    state: { currentIndex, width },
    refCallbacks: { setItemSizeRef, setScrollingZoneRef }
  } = useLimitedHorizontalSwipe(imageList, {
    sensitivity: 2,
    sizeOptions: { fixedSize: fixedSizes?.fixedWidth, minSize: STORE_IMAGE_SIZES.SMALL }
  })

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={node => {
        setCarouselContainerRef(node)
        setItemSizeRef(node)
      }}
      $fixedHeight={(fixedSizes?.fixedHeight || parentWidth) + 'px'}
    >
      <CarouselIndicators size={imageList.length} currentIndex={currentIndex} color={buttonColor} />
      {/* CAROUSEL CONTENT */}
      {springs.map(({ x, display }, index) => {
        const { defaultUrl, ...urlRest } = imageList[index]

        if (!parentWidth) return null

        return (
          <AnimatedDivContainer
            {...bind(index)}
            key={index}
            ref={setScrollingZoneRef}
            style={{ width, x, display, zIndex: index === currentIndex ? 1 : -1 }}
            $borderRadius="0px"
            $withBoxShadow={false}
            $isVerticalScroll={false}
            $touchAction="pinch-zoom"
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
                lqImageOptions: { ...imageTransformations[0], showLoadingIndicator: true, ...lqImageOptions }
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
