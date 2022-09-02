import Carousel, { CarouselProps } from 'components/Carousel'
import { CarouselContainer, CarouselStep, CarouselButtonContainer } from 'components/Carousel/styleds'
import Modal from 'components/Modal'
import styled from 'styled-components/macro'
import { upToSmall } from 'theme/utils'

const LargeImageModal = styled(Modal)`
  ${upToSmall`
  ${CarouselContainer}{
    height: 90%;
    margin: auto 0 0 0;
    ${CarouselStep} {
      // let user scroll
      overflow: auto;
      > ${CarouselButtonContainer} {
        display: none;
      }
    }}
  `}
`

interface LargeImageCarouselModalProps extends CarouselProps {
  isOpen: boolean
  dismissModal: () => void
  toggleModal: () => void
}
export default function LargeImageCarouselModal(props: LargeImageCarouselModalProps) {
  const { isOpen, dismissModal, ...carouselProps } = props
  return (
    <LargeImageModal isOpen={isOpen} onDismiss={dismissModal} isLargeImageModal>
      <Carousel {...carouselProps} fullSizeContent />
    </LargeImageModal>
  )
}
