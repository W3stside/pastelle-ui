import { Row } from '@past3lle/components'
import { pauseShowcaseVideoAnalytics, playShowcaseVideoAnalytics, toggleShowcaseAutoplayAnalytics } from 'analytics'
import { ProductSubHeader } from 'pages/common/styleds'
import { useCallback } from 'react'
import { PauseCircle, PlayCircle, ToggleLeft, ToggleRight } from 'react-feather'
import { useUpdateShowcaseVideoSettings } from 'state/user/hooks'
import styled from 'styled-components/macro'

const ShowcaseVideoControlContainer = styled(Row)`
  background: ${({ theme }) => theme.content.background};
  border-radius: ${({ theme }) => theme.button.border.radius};
  border: 1px solid ${({ theme }) => theme.input.border.colour};
`

export default function ShowcaseVideoControls({ isMobile }: { isMobile: boolean }) {
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

  if (isMobile) return null

  return (
    <ShowcaseVideoControlContainer alignItems={'center'} justifyContent="space-evenly" padding="0 1.2rem" css={``}>
      <Row
        alignItems={'center'}
        justifyContent="space-evenly"
        css={`
          flex: 1;
        `}
      >
        <ProductSubHeader
          margin="0"
          paddingLeft="0"
          backgroundColor={'transparent'}
          fontSize={'1.2rem'}
          fontWeight={300}
        >
          VIDEO SETTINGS
        </ProductSubHeader>
      </Row>
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
        <Row
          width="auto"
          css={`
            gap: 1rem;
          `}
          alignItems="center"
          backgroundColor="inherit"
          padding="0.5rem 1rem"
          borderRadius="1rem"
        >
          <Row
            width="auto"
            css={`
              gap: 0.5rem;
            `}
          >
            {status === 'pause' ? (
              <>
                PLAY <PlayCircle size={30} onClick={handlePlayVideo} />
              </>
            ) : (
              <>
                PAUSE <PauseCircle size={30} onClick={handlePauseVideo} />
              </>
            )}
          </Row>
          <Row
            width="auto"
            css={`
              gap: 0.5rem;
            `}
            onClick={handleToggleAutoplay}
          >
            AUTOPLAY {!autoplay ? <ToggleLeft size={40} fill="red" /> : <ToggleRight size={40} fill="green" />}
          </Row>
        </Row>
      </Row>
    </ShowcaseVideoControlContainer>
  )
}
