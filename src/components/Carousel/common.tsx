import { ChevronLeft, ChevronRight } from 'react-feather'
import { BaseCarouselProps } from './types'
import {
  CarouselButtonContainer,
  CarouselButton,
  StaticCarouselStep,
  CarouselIndicator,
  CarouselIndicatorWrapper
} from './styleds'

export type CarouselStepsProps = Pick<BaseCarouselProps, 'accentColor' | 'onCarouselItemClick'> & {
  children: React.ReactNode
  index: number
  parentWidth: number
  transformAmount: number

  showButtons?: boolean
  showIndicators?: boolean

  isMultipleCarousel?: boolean
  onNext?: ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | null
  onPrev?: ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | null
}

export function CarouselStep(props: CarouselStepsProps) {
  const {
    children,
    index,
    accentColor,
    transformAmount,
    parentWidth,
    showButtons,
    isMultipleCarousel,
    onCarouselItemClick,
    onNext,
    onPrev
  } = props

  return (
    <StaticCarouselStep
      id={'carousel-step-' + index}
      justifyContent="center"
      $transformAmount={transformAmount}
      $width={parentWidth}
    >
      {children}
      {showButtons && isMultipleCarousel && (
        <CarouselButtonContainer onClick={onCarouselItemClick}>
          <CarouselButton onClick={onPrev ?? undefined} buttonColor={accentColor}>
            <ChevronLeft />
          </CarouselButton>
          <CarouselButton onClick={onNext ?? undefined} buttonColor={accentColor}>
            <ChevronRight />
          </CarouselButton>
        </CarouselButtonContainer>
      )}
    </StaticCarouselStep>
  )
}

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
