import { AnimatedCarousel, BaseCarouselProps } from '@past3lle/carousel'
import { usePinchZoomAndDrag } from '@past3lle/carousel-hooks'
import { Modal } from '@past3lle/components'
import { upToSmall } from '@past3lle/theme'
import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components/macro'
import { ShopImageSrcSet } from 'types'

const LargeImageModal = styled(Modal)<{ zoomLevel: number }>`
  padding-bottom: 5rem;

  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  #carousel-container {
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

    > div > div {
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

interface LargeImageCarouselModalProps extends BaseCarouselProps<ShopImageSrcSet[]> {
  isOpen: boolean
  forwardedRef?: ForwardedRef<unknown>
  dismissModal: () => void
  toggleModal: () => void
}
export function LargeImageCarouselModalWithoutRef(props: LargeImageCarouselModalProps) {
  const { isOpen, dismissModal, ...carouselProps } = props

  const animationProps = usePinchZoomAndDrag(carouselProps.data, {
    styleMixin: { width: '100%' },
  })

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
