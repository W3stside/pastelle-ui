import { AnimatedDivContainer } from 'components/ScrollingContentPage/styleds'

import { CarouselIndicators, CarouselStep } from '../common'
import { useCarouselSetup } from '../hooks'
import { BaseAnimatedCarouselProps } from '../types'
import { CarouselContainer } from './styleds'

export default function AnimatedCarousel({
  data,
  animationProps,
  fixedSizes,
  accentColor,
  touchAction,
  children
}: BaseAnimatedCarouselProps) {
  const {
    parentWidth,
    imageTransformations: defaultImageTransforms,
    setCarouselContainerRef
  } = useCarouselSetup({
    fixedSizes
  })

  const {
    bind,
    springs,
    state: { currentIndex, itemSize: width },
    refCallbacks: { setItemSizeRef, setScrollingZoneRef }
  } = animationProps

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={(node) => {
        setCarouselContainerRef(node)
        setItemSizeRef(node)
      }}
      $fixedHeight={(fixedSizes?.height || parentWidth) + 'px'}
      $touchAction={touchAction}
    >
      <CarouselIndicators size={data.length} currentIndex={currentIndex} color={accentColor} />
      {/* CAROUSEL CONTENT */}
      {springs.map((props, index, { length }) => {
        if (!parentWidth) return null

        return (
          <AnimatedDivContainer
            {...bind(index)}
            key={index}
            ref={setScrollingZoneRef}
            style={{ width, ...props }}
            $borderRadius="0px"
            $withBoxShadow={false}
            $isVerticalScroll={false}
            $touchAction={touchAction}
          >
            <CarouselStep
              index={index}
              accentColor={accentColor}
              parentWidth={parentWidth}
              transformAmount={0}
              showButtons={false}
            >
              {children({ index, defaultImageTransforms, isLast: index === length - 1 })}
            </CarouselStep>
          </AnimatedDivContainer>
        )
      })}
    </CarouselContainer>
  )
}
