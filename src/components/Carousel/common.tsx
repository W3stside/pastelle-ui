import SmartImg, { SmartImageProps } from 'components/SmartImg'
import { ForwardedRef, forwardRef, RefObject } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { BaseCarouselProps } from './types'
import {
  CarouselButtonContainer,
  CarouselButton,
  StaticCarouselStep,
  CarouselIndicator,
  CarouselIndicatorWrapper
} from './styleds'

export type CarouselStepsProps = Pick<BaseCarouselProps, 'buttonColor' | 'onImageClick'> & {
  index: number
  size: number
  imageProps: SmartImageProps
  parentWidth: number
  transformAmount: number
  isMultipleCarousel: boolean
  showButtons?: boolean
  showIndicators?: boolean

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
    showButtons,
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
      {showButtons && isMultipleCarousel && (
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

export const CarouselIndicators = ({
  color,
  currentIndex,
  size
}: {
  color?: string
  currentIndex: number
  size: number
}) => {
  if (size <= 1) return null

  return (
    <CarouselIndicatorWrapper>
      {Array.from({ length: size }).map((_, index) => (
        <CarouselIndicator key={index} isCurrent={currentIndex === index} color={color} />
      ))}
    </CarouselIndicatorWrapper>
  )
}
