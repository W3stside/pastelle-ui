import MainImage, { ImageProps } from 'components/MainImage'
import { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { CarouselContainer, CarouselStep, CarouselButtonContainer, CarouselButton } from './styleds'

type CarouselProps = {
  fixedHeight?: string
  buttonColor: string
  imageList: string[]
  transformation: ImageProps['transformation']
  mediaStartIndex: number
  onCarouselChange?: (index: number) => void
}

export default function Carousel({
  fixedHeight,
  buttonColor,
  imageList,
  transformation,
  mediaStartIndex,
  onCarouselChange
}: CarouselProps) {
  const [ref, setRef] = useState<HTMLDivElement>()
  const [parentWidth, setParentWidth] = useState<number | undefined>()
  const [selectedStep, setSelectedStep] = useState(mediaStartIndex)

  const { isMultipleCarousel, lastStepIndex } = useMemo(
    () => ({
      isMultipleCarousel: imageList.length > 0,
      lastStepIndex: imageList.length - 1
    }),
    [imageList.length]
  )
  // get a ref to the carouselImageboi
  const carouselImageRef = useRef<HTMLImageElement | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)

  // set ref states and focus carousel
  useEffect(() => {
    setRef(carouselRef.current ?? undefined)
    setParentWidth(ref?.parentElement?.offsetWidth)

    ref?.focus()
  }, [ref])

  // get a ref to the carouselboi
  // we need to hold and updated cache of the carousel parent's width in px
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    function handleResize() {
      setParentWidth(ref?.parentElement?.offsetWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [parentWidth, ref?.parentElement?.offsetWidth])

  return (
    <CarouselContainer id="#carousel-container" ref={carouselRef} fixedHeight={fixedHeight}>
      {/* CAROUSEL CONTENT */}
      {imageList.map((path, index) => {
        if (!parentWidth) return null
        const isCurrentStep = index === selectedStep
        // has multiple steps and is on last item
        const isLastStep = isMultipleCarousel && selectedStep === lastStepIndex
        const calculatedWidth = isCurrentStep ? parentWidth : 0

        const onNext = () => {
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

        const onPrevious = () => {
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
            id={'#carousel-step-' + index}
            key={index}
            justifyContent={'center'}
            $calculatedWidth={calculatedWidth + 'px'}
          >
            <MainImage path={path} transformation={transformation} ref={carouselImageRef} />
            {isMultipleCarousel && (
              <CarouselButtonContainer>
                <CarouselButton onClick={onPrevious} buttonColor={buttonColor}>
                  <ChevronLeft />
                </CarouselButton>
                <CarouselButton onClick={onNext} buttonColor={buttonColor}>
                  <ChevronRight />
                </CarouselButton>
              </CarouselButtonContainer>
            )}
          </CarouselStep>
        )
      })}
    </CarouselContainer>
  )
}
