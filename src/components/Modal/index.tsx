import { DialogContent, DialogOverlay } from '@reach/dialog'
import { transparentize } from 'polished'
import { animated, useSpring, useTransition } from 'react-spring'
import { useGesture } from '@use-gesture/react'
import styled, { css } from 'styled-components/macro'
import { isMobile } from 'utils'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: transparent;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme }) => theme.modalBG};
  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, mobile, isOpen, isLargeImageModal, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog'
})`
  overflow-y: auto;

  overflow: hidden;
  border: none;

  &[data-reach-dialog-content] {
    outline: none;
    margin: 0 0 2rem 0;
    background-color: ${({ theme }) => theme.bg0};
    box-shadow: 0px 4px 8px 0px ${({ theme }) => transparentize(0.95, theme.shadow1)};
    padding: 0px;
    width: ${({ isLargeImageModal }) => (isLargeImageModal ? '90' : '50')}vh;
    overflow-y: ${({ isLargeImageModal }) => (!isLargeImageModal ? 'auto' : 'hidden')};
    overflow-x: hidden;

    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};

    max-width: ${({ maxHeight, isLargeImageModal = false }) =>
      css`
        ${isLargeImageModal ? maxHeight + 'vh' : '420px'}
      `};
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight}vh;
      `}
    display: flex;
    border-radius: 20px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 90vw;
      margin: 0;
    `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
    width: 100%;
    // height: 90vh;

    border-radius: 20px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin: auto;

    img {
      max-width: 180%;
      margin: auto;
    }
    // TODO: remove
    ${mobile &&
      css`
        width: 100vw;
        height: 90vh;

        border-radius: 20px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        margin: auto;

        img {
          max-width: 150%;
        }
      `}
  `}
  }
`

interface ModalProps {
  isLargeImageModal?: boolean
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  className?: string
  children?: React.ReactNode
}

export default function Modal({
  isLargeImageModal = false,
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  initialFocusRef,
  className,
  children
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  const [{ y }, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
  const bind = useGesture({
    onDrag: state => {
      set({
        y: state.down ? state.movement[1] : 0
      })
      if (state.movement[1] > 150 || (state.direction[1] > 3 && state.direction[1] > 0)) {
        onDismiss()
      }
    }
  })

  return (
    <>
      {fadeTransition(
        (styles, item) =>
          item && (
            <StyledDialogOverlay
              className={className}
              style={styles}
              onDismiss={onDismiss}
              initialFocusRef={initialFocusRef}
              unstable_lockFocusAcrossFrames={false}
            >
              <StyledDialogContent
                {...(isMobile
                  ? {
                      ...bind(),
                      style: { transform: y.to(y => `translateY(${(y as number) > 0 ? y : 0}px)`) }
                    }
                  : {})}
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                mobile={isMobile}
                isLargeImageModal={isLargeImageModal}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
              {isMobile && (
                <h1
                  onClick={onDismiss}
                  style={{
                    background: '#AB92E1',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    margin: 10,
                    padding: '5px 10px',
                    textAlign: 'right'
                  }}
                >
                  CLOSE
                </h1>
              )}
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
