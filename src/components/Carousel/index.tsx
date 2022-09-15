import SmartImg, { SmartImageProps } from 'components/SmartImg'
import { LoadInView } from 'hooks/useDetectScrollIntoView'
import useStateRef from 'hooks/useStateRef'
import { useState, useMemo, /* useRef, */ useEffect, forwardRef, ForwardedRef } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { useGetWindowSize } from 'state/window/hooks'
import {
  CarouselContainer,
  CarouselStep as CarouselStepContainer,
  CarouselButtonContainer,
  CarouselButton
} from './styleds'

export type GenericImageSrcSet = { defaultUrl: string } & { [sizeKey: string]: string }
export type CarouselProps = {
  fixedHeight?: string
  buttonColor: string
  imageList: GenericImageSrcSet[]
  transformation?: SmartImageProps['transformation']
  mediaStartIndex: number
  showCarouselContentIndicators?: boolean
  loadInViewOptions?: LoadInView
  collectionView?: boolean
  fullSizeContent?: boolean
  onCarouselChange?: (index: number) => void
  onImageClick?: () => void
}

type CarouselStepsProps = Pick<CarouselProps, 'buttonColor' | 'showCarouselContentIndicators' | 'onImageClick'> & {
  index: number
  imageProps: SmartImageProps
  parentWidth: number
  transformAmount: number
  isMultipleCarousel: boolean

  forwardedRef?: ForwardedRef<unknown>

  onNext: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onPrev: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

function CarouselStepWithoutRef(props: CarouselStepsProps) {
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
    <CarouselStepContainer
      ref={forwardedRef ?? null}
      id={'carousel-step-' + index}
      justifyContent="center"
      $transformAmount={transformAmount}
      $width={parentWidth}
    >
      <SmartImg {...imageProps} />
      {showCarouselContentIndicators && isMultipleCarousel && (
        <CarouselButtonContainer onClick={onImageClick}>
          <CarouselButton onClick={onPrev} buttonColor={buttonColor}>
            <ChevronLeft />
          </CarouselButton>
          <CarouselButton onClick={onNext} buttonColor={buttonColor}>
            <ChevronRight />
          </CarouselButton>
        </CarouselButtonContainer>
      )}
    </CarouselStepContainer>
  )
}

const CarouselStep = forwardRef(function CarouselStep(props: CarouselStepsProps, ref) {
  return <CarouselStepWithoutRef {...props} forwardedRef={ref} />
})

export default function Carousel({
  fixedHeight,
  buttonColor,
  imageList,
  transformation,
  mediaStartIndex,
  showCarouselContentIndicators = true,
  loadInViewOptions,
  fullSizeContent,
  onCarouselChange,
  onImageClick
}: CarouselProps) {
  const [parentWidth, setParentWidth] = useState<number | undefined>()
  const [selectedStep, setSelectedStep] = useState(mediaStartIndex)

  const { isMultipleCarousel, lastStepIndex } = useMemo(
    () => ({
      isMultipleCarousel: imageList.length > 0,
      lastStepIndex: imageList.length - 1
    }),
    [imageList.length]
  )

  // ref to carousel container
  const [carouselContainer, setCarouselContainerRef] = useStateRef<HTMLDivElement | null>(null, node => node)
  // set carouselContainer states and focus carousel
  useEffect(() => {
    setParentWidth(carouselContainer?.parentElement?.offsetWidth)

    carouselContainer?.focus()
  }, [carouselContainer])

  // get a carouselContainer to the carouselboi
  // we need to hold and updated cache of the carousel parent's width in px
  const sizes = useGetWindowSize()
  useEffect(() => {
    setParentWidth(carouselContainer?.parentElement?.offsetWidth)
  }, [carouselContainer?.parentElement?.offsetWidth, sizes])
  /* useEffect(() => {
    function handleResizeParentWidth() {
      setParentWidth(carouselContainer?.parentElement?.offsetWidth)
    }
    window.addEventListener('resize', handleResizeParentWidth)

    return () => {
      window.removeEventListener('resize', handleResizeParentWidth)
    }
  }, [parentWidth, carouselContainer?.parentElement?.offsetWidth]) */

  const smartImageTransformation = useMemo(
    () => [
      {
        width: carouselContainer?.clientWidth,
        pr: true
      }
    ],
    [carouselContainer?.clientWidth]
  )

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={setCarouselContainerRef}
      fixedHeight={fixedHeight || parentWidth + 'px'}
    >
      {/* CAROUSEL CONTENT */}
      {imageList.map(({ defaultUrl, ...urlRest }, index) => {
        if (!parentWidth) return null
        const isCurrentStep = index === selectedStep
        // has multiple steps and is on last item
        const isLastStep = isMultipleCarousel && selectedStep === lastStepIndex
        const calculatedWidth = isCurrentStep ? 0 : parentWidth

        const onNext = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation()
          let indexToSet = undefined
          if (isLastStep) {
            indexToSet = 0
          } else {
            indexToSet = selectedStep + 1
          }
          // change carousel slide
          setSelectedStep(indexToSet)
          // side effect change item video
          onCarouselChange && onCarouselChange(indexToSet)
        }

        const onPrevious = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation()
          let indexToSet = undefined
          if (selectedStep === 0) {
            indexToSet = lastStepIndex
          } else {
            indexToSet = selectedStep - 1
          }
          // change carousel slide
          setSelectedStep(indexToSet)
          // side effect change item video
          onCarouselChange && onCarouselChange(indexToSet)
        }

        return (
          <CarouselStep
            key={index}
            index={index}
            parentWidth={parentWidth}
            transformAmount={calculatedWidth}
            showCarouselContentIndicators={showCarouselContentIndicators}
            isMultipleCarousel={isMultipleCarousel}
            buttonColor={buttonColor}
            // cbs&handlers
            onNext={onNext}
            onPrev={onPrevious}
            onImageClick={onImageClick}
            // image props
            imageProps={{
              path: { defaultPath: defaultUrl },
              pathSrcSet: fullSizeContent ? undefined : urlRest,
              transformation: transformation || smartImageTransformation,
              loadInView: loadInViewOptions
            }}
          />
        )
      })}
    </CarouselContainer>
  )
}
