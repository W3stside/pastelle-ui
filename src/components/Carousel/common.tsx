import SmartImg, { SmartImageProps } from 'components/SmartImg'
import { ForwardedRef, forwardRef, RefObject } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { BaseCarouselProps } from './types'
import { CarouselButtonContainer, CarouselButton, StaticCarouselStep } from './styleds'

export type CarouselStepsProps = Pick<BaseCarouselProps, 'buttonColor' | 'onImageClick'> & {
  index: number
  imageProps: SmartImageProps
  parentWidth: number
  transformAmount: number
  isMultipleCarousel: boolean
  showCarouselContentIndicators?: boolean

  forwardedRef?: ForwardedRef<unknown>

  onNext: ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | null
  onPrev: ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | null
}

export function CarouselStepWithoutRef(props: CarouselStepsProps) {
  const {
    index,
    imageProps,
    buttonColor,
    transformAmount,
    parentWidth,
    showCarouselContentIndicators,
    isMultipleCarousel,
    forwardedRef,
    onImageClick,
    onNext,
    onPrev
  } = props

  return (
    <StaticCarouselStep
      ref={
        (forwardedRef as ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined) ??
        null
      }
      id={'carousel-step-' + index}
      justifyContent="center"
      $transformAmount={transformAmount}
      $width={parentWidth}
    >
      <SmartImg {...imageProps} ref={imageProps.forwardedRef} />
      {showCarouselContentIndicators && isMultipleCarousel && (
        <CarouselButtonContainer onClick={onImageClick}>
          <CarouselButton onClick={onPrev ?? undefined} buttonColor={buttonColor}>
            <ChevronLeft />
          </CarouselButton>
          <CarouselButton onClick={onNext ?? undefined} buttonColor={buttonColor}>
            <ChevronRight />
          </CarouselButton>
        </CarouselButtonContainer>
      )}
    </StaticCarouselStep>
  )
}

export const CarouselStep = forwardRef(function CarouselStep(props: CarouselStepsProps, ref) {
  return <CarouselStepWithoutRef {...props} forwardedRef={ref} />
})
