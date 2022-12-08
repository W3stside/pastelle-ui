import { AnimatedDivContainer } from 'components/ScrollingContentPage/styleds'
import { CarouselIndicators, CarouselStep } from './common'
import { useCarouselSetup } from './hooks'
import { CarouselContainer } from './styleds'
import { BaseCarouselProps } from './types'
import { useLimitedHorizontalScroll } from 'hooks/useScrollAnimation'

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

  const {
    bind,
    springs,
    state: { currentIndex, width },
    refCallbacks: { setItemSizeRef }
  } = useLimitedHorizontalScroll(imageList, { sensitivity: 2 })

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={node => {
        setCarouselContainerRef(node)
        setItemSizeRef(node)
      }}
      $fixedHeight={fixedHeight || parentWidth + 'px'}
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
            style={{ width, x, display }}
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
