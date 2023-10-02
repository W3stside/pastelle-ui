import { Row } from '@past3lle/components'
import { pauseShowcaseVideoAnalytics, playShowcaseVideoAnalytics, toggleShowcaseAutoplayAnalytics } from 'analytics'
import { useCallback } from 'react'
import { PauseCircle, PlayCircle, ToggleLeft, ToggleRight } from 'react-feather'
import { BoxProps } from 'rebass'
import { useUpdateShowcaseVideoSettings } from 'state/user/hooks'
import styled, { useTheme } from 'styled-components/macro'
import { BLACK_TRANSPARENT } from 'theme/colours'

const ShowcaseVideoControlContainer = styled(Row)`
  flex-flow: column nowrap;
  background: ${(props) => props.theme.content.background};
  border-radius: ${({ theme }) => theme.button.border.radius};
  border: ${({ theme }) => `1px solid ${theme.input.border.colour}`};
`

export default function ShowcaseVideoControls({ isMobile, ...containerProps }: BoxProps & { isMobile: boolean }) {
  const [{ autoplay, status }, updateSettings] = useUpdateShowcaseVideoSettings()

  const handlePauseVideo = useCallback(() => {
    pauseShowcaseVideoAnalytics()
    updateSettings({ autoplay, status: 'pause' })
  }, [autoplay, updateSettings])

  const handlePlayVideo = useCallback(() => {
    playShowcaseVideoAnalytics()
    updateSettings({ autoplay, status: 'play' })
  }, [autoplay, updateSettings])

  const handleToggleAutoplay = useCallback(() => {
    toggleShowcaseAutoplayAnalytics(!autoplay)
    updateSettings({ autoplay: !autoplay, status })
  }, [autoplay, status, updateSettings])

  const { mode } = useTheme()

  if (isMobile) return null

  return (
    <ShowcaseVideoControlContainer
      alignItems={'center'}
      justifyContent="space-evenly"
      padding="0 1.2rem"
      css={``}
      {...containerProps}
    >
      <Row
        alignItems={'center'}
        justifyContent="flex-end"
        css={`
          flex: 2;
          gap: 1rem;
          svg {
            cursor: pointer;
          }
        `}
      >
        VIDEO SETTINGS
        <Row
          width="auto"
          css={`
            gap: 1rem;
          `}
          alignItems="center"
          backgroundColor="inherit"
          padding="0.5rem 1rem"
          borderRadius="1rem"
          marginLeft="auto"
        >
          <Row
            width="auto"
            fontWeight={500}
            css={`
              gap: 0.5rem;
            `}
            onClick={handleToggleAutoplay}
          >
            AUTOPLAY{' '}
            {!autoplay ? (
              <ToggleLeft size={40} fill="red" stroke={BLACK_TRANSPARENT} />
            ) : (
              <ToggleRight size={40} fill="green" stroke={BLACK_TRANSPARENT} />
            )}
          </Row>
          <Row
            width="auto"
            fontWeight={500}
            css={`
              gap: 0.5rem;
            `}
          >
            {status === 'pause' ? (
              <PlayCircle size={30} onClick={handlePlayVideo} stroke={mode === 'DARK' ? 'grey' : BLACK_TRANSPARENT} />
            ) : (
              <PauseCircle size={30} onClick={handlePauseVideo} stroke={'grey'} />
            )}
          </Row>
        </Row>
      </Row>
    </ShowcaseVideoControlContainer>
  )
}
