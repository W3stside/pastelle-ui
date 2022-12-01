import ButtonCarousel from 'components/Carousel/ButtonCarousel'
import { CarouselContainer, StaticCarouselStep } from 'components/Carousel/styleds'
import { BaseCarouselProps } from 'components/Carousel/types'
import { Row } from 'components/Layout'
import Modal from 'components/Modal'
import { SyntheticEvent, useCallback, useState } from 'react'
import { ZoomIn, ZoomOut } from 'react-feather'
import styled from 'styled-components/macro'
import { CloseIcon } from 'theme'
import { upToSmall } from 'theme/utils'
import { isMobile } from 'utils'

const LargeImageModal = styled(Modal)<{ zoomLevel: number }>`
  padding-bottom: 5rem;
  user-select: none;

  ${CarouselContainer} {
    height: 100%;
    width: 100%;
    overflow: auto;
    margin: auto;

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

interface ModalBottomControlsProps {
  zoomLevel: number
  closeCb: () => void
  zoomOutCb: (e: SyntheticEvent) => false | void
  zoomInCb: (e: SyntheticEvent) => false | void
}
const ModalBottomControls = ({ zoomLevel, closeCb, zoomOutCb, zoomInCb }: ModalBottomControlsProps) => (
  <Row
    justifyContent="space-between"
    backgroundColor="#ab92e1a6"
    width={isMobile ? '40%' : '15vw'}
    minWidth="8rem"
    margin={10}
    padding="1rem 1.5rem"
    textAlign={'center'}
    borderRadius="1rem"
    style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      gap: '0.5rem'
    }}
  >
    <ZoomIn
      stroke={zoomLevel < 3 ? 'ghostwhite' : 'grey'}
      size={isMobile ? 30 : '2.2vw'}
      onClick={zoomInCb}
      style={{ cursor: 'pointer' }}
    />
    <ZoomOut
      stroke={zoomLevel > 1 ? 'ghostwhite' : 'grey'}
      size={isMobile ? 30 : '2.2vw'}
      onClick={zoomOutCb}
      style={{ cursor: 'pointer' }}
    />
    <CloseIcon size={isMobile ? 30 : '2.2vw'} onClick={closeCb} />
  </Row>
)

interface LargeImageCarouselModalProps extends BaseCarouselProps {
  isOpen: boolean
  dismissModal: () => void
  toggleModal: () => void
}
export default function LargeImageCarouselModal(props: LargeImageCarouselModalProps) {
  const { isOpen, dismissModal: dismissModalPre, ...carouselProps } = props

  const dismissModal = useCallback(() => {
    setZoomLevel(1)
    dismissModalPre()
  }, [dismissModalPre])

  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const zoomIn = (e: SyntheticEvent) => {
    e.preventDefault()
    return zoomLevel < 3 && setZoomLevel(state => state + 1)
  }
  const zoomOut = (e: SyntheticEvent) => {
    e.preventDefault()
    return zoomLevel > 1 && setZoomLevel(state => state - 1)
  }

  return (
    <LargeImageModal isOpen={isOpen} onDismiss={dismissModal} isLargeImageModal zoomLevel={zoomLevel}>
      <ButtonCarousel {...carouselProps} fullSizeContent />
      <ModalBottomControls zoomInCb={zoomIn} closeCb={dismissModal} zoomOutCb={zoomOut} zoomLevel={zoomLevel} />
    </LargeImageModal>
  )
}
