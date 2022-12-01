import AnimatedCarousel from 'components/Carousel/AnimatedCarousel'
import ButtonCarousel from 'components/Carousel/ButtonCarousel'
import { CarouselContainer, StaticCarouselStep, CarouselButtonContainer } from 'components/Carousel/styleds'
import { BaseCarouselProps } from 'components/Carousel/types'
import Modal from 'components/Modal'
import { useMemo } from 'react'
import styled from 'styled-components/macro'
import { upToSmall } from 'theme/utils'
import { isMobile } from 'utils'

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
  const Carousel = useMemo(() => (isMobile && props.imageList.length > 1 ? AnimatedCarousel : ButtonCarousel), [
    props.imageList.length
  ])
  return (
    <LargeImageModal isOpen={isOpen} onDismiss={dismissModal} isLargeImageModal>
      <Carousel {...carouselProps} fullSizeContent />
    </LargeImageModal>
  )
}
