import AnimatedCarousel from 'components/Carousel/AnimatedCarousel'
import { CarouselContainer, StaticCarouselStep, CarouselButtonContainer } from 'components/Carousel/styleds'
import { BaseCarouselProps } from 'components/Carousel/types'
import Modal from 'components/Modal'
import styled from 'styled-components/macro'
import { upToSmall } from 'theme/utils'

const LargeImageModal = styled(Modal)`
  ${upToSmall`
  ${CarouselContainer}{
    height: 90%;
    margin: auto 0 0 0;
    ${StaticCarouselStep} {
      // let user scroll
      overflow: auto;
      > ${CarouselButtonContainer} {
        display: none;
      }
    }}
  `}
`

interface LargeImageCarouselModalProps extends BaseCarouselProps {
  isOpen: boolean
  dismissModal: () => void
  toggleModal: () => void
}
export default function LargeImageCarouselModal(props: LargeImageCarouselModalProps) {
  const { isOpen, dismissModal, ...carouselProps } = props
  return (
    <LargeImageModal isOpen={isOpen} onDismiss={dismissModal} isLargeImageModal>
      <AnimatedCarousel {...carouselProps} fullSizeContent />
    </LargeImageModal>
  )
}
