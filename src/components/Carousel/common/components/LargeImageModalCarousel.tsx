import Modal from 'components/Modal'
import styled from 'styled-components/macro'
import AnimatedCarousel from 'components/Carousel/common/components/AnimatedCarousel'
import { CarouselContainer, StaticCarouselStep } from 'components/Carousel/common/components/styleds'
import { BaseCarouselProps } from 'components/Carousel/common/types'
import { usePinchZoomAndDrag } from 'hooks/useScrollAnimation/usePinchDragAndZoom'
import { ForwardedRef, forwardRef } from 'react'
import { upToSmall } from 'theme/utils'

const LargeImageModal = styled(Modal)<{ zoomLevel: number }>`
  padding-bottom: 5rem;

  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  ${CarouselContainer} {
    height: 100%;
    width: 100%;
    overflow: auto;
    margin: auto;

    picture,
    source,
    img,
    video {
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    ${upToSmall`
      width: 100%;
    `}

    ${StaticCarouselStep} {
      margin: auto;
      justify-content: flex-start;
      overflow: auto;

      > picture {
        overflow: auto;
        justify-content: flex-start;

        > img {
          max-width: ${({ zoomLevel }) => 100 * zoomLevel}%;
        }
      }
    }
  }
`

interface LargeImageCarouselModalProps extends BaseCarouselProps {
  isOpen: boolean
  forwardedRef?: ForwardedRef<unknown>
  dismissModal: () => void
  toggleModal: () => void
}
export function LargeImageCarouselModalWithoutRef(props: LargeImageCarouselModalProps) {
  const { isOpen, dismissModal, ...carouselProps } = props

  const animationProps = usePinchZoomAndDrag(carouselProps.data, { styleMixin: { width: '100%' } })

  return (
    <LargeImageModal isOpen={isOpen} onDismiss={dismissModal} isLargeImageModal zoomLevel={1}>
      <AnimatedCarousel {...carouselProps} touchAction={'none'} animationProps={animationProps} />
    </LargeImageModal>
  )
}

const LargeImageCarouselModal = forwardRef((props: LargeImageCarouselModalProps, ref) => (
  <LargeImageCarouselModalWithoutRef {...props} forwardedRef={ref} />
))
LargeImageCarouselModal.displayName = 'LargeImageCarouselModal'

export default LargeImageCarouselModal
