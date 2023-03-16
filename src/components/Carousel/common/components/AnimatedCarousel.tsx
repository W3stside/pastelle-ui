import { AnimatedDivContainer } from 'components/ScrollingContentPage/styleds'
import { useMemo } from 'react'

import { CarouselIndicators, CarouselStep } from '../common'
import { useCarouselSetup } from '../hooks'
import { BaseAnimatedCarouselProps } from '../types'
import { CarouselContainer } from './styleds'

export default function AnimatedCarousel<D extends any[]>({
  data,
  axis,
  animationProps,
  dimensions,
  colors,
  touchAction,
  children,
}: BaseAnimatedCarouselProps<D>) {
  const {
    parentSizes,
    imageTransformations: defaultImageTransforms,
    setCarouselContainerRef,
  } = useCarouselSetup(dimensions)

  const {
    bind,
    springs,
    state: { currentIndex, itemSize },
    refCallbacks: { setItemSizeRef, setScrollingZoneRef },
  } = animationProps

  const calculatedSizes = useMemo(
    () =>
      dimensions?.fillContainer
        ? { height: '100%', width: '100%' }
        : axis === 'x'
        ? { width: Math.max(itemSize, parentSizes?.width || 0) }
        : { height: Math.max(itemSize, parentSizes?.height || 0) },
    [axis, dimensions?.fillContainer, itemSize, parentSizes?.height, parentSizes?.width]
  )

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={(node) => {
        setCarouselContainerRef(node)
        setItemSizeRef(node)
      }}
      $fixedHeight={dimensions?.fixedSizes?.height || parentSizes?.height || parentSizes?.width}
      $touchAction={touchAction}
    >
      <CarouselIndicators size={data.length} currentIndex={currentIndex} color={colors?.accent || 'black'} />
      {/* CAROUSEL CONTENT */}
      {springs.map((interpolatedProps, index, { length }) => {
        if (!parentSizes?.width || !parentSizes?.height) return null

        const animatedStyleProps = { ...interpolatedProps, ...calculatedSizes }

        return (
          <AnimatedDivContainer
            {...bind(index)}
            key={index}
            ref={setScrollingZoneRef}
            style={animatedStyleProps}
            // custom style props
            $axis={axis}
            $borderRadius="0px"
            $touchAction={touchAction}
            $withBoxShadow={false}
          >
            <CarouselStep
              index={index}
              colors={colors}
              parentWidth={parentSizes.width}
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
