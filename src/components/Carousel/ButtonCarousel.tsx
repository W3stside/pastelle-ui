import { ForwardedRef, forwardRef, useMemo, useState } from 'react'
import { setForwardedRef } from 'utils'
import { CarouselStep } from './common'
import { useCarouselSetup } from './hooks'
import { CarouselContainer } from './styleds'
import { BaseCarouselProps } from './types'

export interface ButtonCarouselProps extends BaseCarouselProps {
  showButtons?: boolean
  forwardedRef?: ForwardedRef<HTMLDivElement>
  onCarouselChange?: (index: number) => void
}

export default function ButtonCarousel({
  imageList,
  startIndex,
  showButtons,
  fixedHeight,
  buttonColor,
  transformation,
  fullSizeContent,
  loadInViewOptions,
  forwardedRef,
  collectionView,
  onCarouselChange,
  onImageClick
}: ButtonCarouselProps) {
  const [selectedStep, setSelectedStep] = useState(startIndex)
  const { parentWidth, imageTransformations, setCarouselContainerRef } = useCarouselSetup({
    startIndex,
    fixedHeight
  })

  const { isMultipleCarousel, lastStepIndex } = useMemo(
    () => ({
      isMultipleCarousel: imageList.length > 1,
      lastStepIndex: imageList.length - 1
    }),
    [imageList.length]
  )

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={node => {
        setCarouselContainerRef(node)
        node && forwardedRef && setForwardedRef(node, forwardedRef)
      }}
      $fixedHeight={fixedHeight || parentWidth + 'px'}
    >
      {/* CAROUSEL CONTENT */}
      {imageList.map(({ defaultUrl, ...urlRest }, index) => {
        if (!parentWidth) return null
        const isCurrentStep = !isMultipleCarousel || index === selectedStep
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
            buttonColor={buttonColor}
            // cbs&handlers
            onNext={onNext}
            onPrev={onPrevious}
            onImageClick={onImageClick}
            // image props
            imageProps={{
              path: { defaultPath: defaultUrl },
              pathSrcSet: fullSizeContent ? undefined : urlRest,
              transformation: transformation || imageTransformations,
              loadInViewOptions,
              lqImageOptions: { ...imageTransformations[0], showLoadingIndicator: !collectionView }
            }}
            // flags
            showIndicators
            showButtons={showButtons}
            isMultipleCarousel={isMultipleCarousel}
          />
        )
      })}
    </CarouselContainer>
  )
}

export const ButtonCarouselWithRef = forwardRef(function ButtonCarouselWithRef(props: any, ref) {
  return <ButtonCarousel {...props} forwardedRef={ref} />
})
