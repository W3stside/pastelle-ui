import Carousel, { CarouselProps } from 'components/Carousel'
import Modal from 'components/Modal'

interface LargeImageCarouselModalProps extends CarouselProps {
  isOpen: boolean
  toggleModal: () => void
}
export default function LargeImageCarouselModal(props: LargeImageCarouselModalProps) {
  const { isOpen, toggleModal, ...carouselProps } = props
  return (
    <Modal isOpen={isOpen} onDismiss={toggleModal} isLargeImageModal>
      <Carousel {...carouselProps} fullSizeContent />
    </Modal>
  )
}
