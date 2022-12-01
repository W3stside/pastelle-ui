import { AnimatedDivContainer } from 'components/ScrollingContentPage/styleds'
import useHorizontalScrollingAnimation from 'hooks/useHorizontalScrollingAnimation'
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

  const { currentIndex, itemWidth, springs, setScrollingZoneRef, setWidthRef } = useHorizontalScrollingAnimation(
    imageList,
    {
      snapOnScroll: true,
      visible: 1
    }
  )

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={node => {
        setCarouselContainerRef(node)
        setScrollingZoneRef(node)
        setWidthRef(node)
      }}
      fixedHeight={fixedHeight || parentWidth + 'px'}
    >
      {/* CAROUSEL CONTENT */}
      {springs.map(({ x, scale }, index) => {
        const { defaultUrl, ...urlRest } = imageList[index]

        if (!parentWidth) return null

        return (
          <>
            <CarouselIndicators size={imageList.length} currentIndex={currentIndex} color={buttonColor} />
            <AnimatedDivContainer
              key={index}
              style={{ scale, width: itemWidth, x }}
              $borderRadius="0px"
              $withBoxShadow={false}
              $isVerticalScroll={false}
            >
              <CarouselStep
                index={index}
                size={imageList.length}
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
          </>
        )
      })}
    </CarouselContainer>
  )
}
