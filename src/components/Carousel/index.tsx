import { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { CarouselContainer, CarouselStep, CarouselButtonContainer, CarouselButton } from './styleds'
import { ApparelItem } from 'mock/apparel/types'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import Modal from 'components/Modal'

type CarouselProps = {
  buttonColor: string
  mediaList: ApparelItem[]
  mediaStartIndex: number
  onCarouselChange?: (index: number) => void
}

export default function Carousel({ buttonColor, mediaList, mediaStartIndex, onCarouselChange }: CarouselProps) {
  const [selectedStep, setSelectedStep] = useState(mediaStartIndex)
  const [parentWidth, setParentWidth] = useState<number | undefined>()

  const { isMultipleCarousel, lastStepIndex } = useMemo(
    () => ({
      isMultipleCarousel: mediaList.length > 0,
      lastStepIndex: mediaList.length - 1
    }),
    [mediaList.length]
  )
  // get a ref to the carouselImageboi
  const carouselImageRef = useRef<HTMLImageElement | null>(null)
  useEffect(() => {
    carouselImageRef.current?.focus()
  }, [])
  // get a ref to the carouselboi
  const carouselRef = useRef<HTMLDivElement | null>(null)
  // we need to hold and updated cache of the carousel parent's width in px
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (carouselRef.current) {
      const { parentElement } = carouselRef.current
      setParentWidth(parentElement?.offsetWidth)
    }
  })

  const toggleModal = useToggleModal(ApplicationModal.ITEM_LARGE_IMAGE)
  const showLargeImage = useModalOpen(ApplicationModal.ITEM_LARGE_IMAGE)

  return (
    <CarouselContainer id="#carousel-container" ref={carouselRef}>
      {/* CAROUSEL CONTENT */}
      {mediaList.map(({ imageMedia: { small, large } }, index) => {
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
            {/* LARGE IMAGE MODAL */}
            <Modal isOpen={showLargeImage} onDismiss={toggleModal} minHeight={1000}>
              <img src={large} />
            </Modal>
            <img src={small} ref={carouselImageRef} onClick={toggleModal} />
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
