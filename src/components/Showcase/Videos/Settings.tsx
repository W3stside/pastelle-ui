import { Row } from '@past3lle/components'
import { ProductSubHeader } from 'pages/common/styleds'
import { PauseCircle, PlayCircle, ToggleLeft, ToggleRight } from 'react-feather'
import { useUpdateShowcaseVideoSettings } from 'state/user/hooks'
import styled from 'styled-components/macro'

const ShowcaseVideoControlContainer = styled(Row)`
  background: ${({ theme }) => theme.products.aside.itemContainer};
  border-radius: ${({ theme }) => theme.buttons.borderRadius};
  border: 1px solid ${({ theme }) => theme.products.aside.inputsBorderColor};
`

export default function ShowcaseVideoControls({ isMobile }: { isMobile: boolean }) {
  const [{ autoplay, status }, updateSettings] = useUpdateShowcaseVideoSettings()
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
                PLAY <PlayCircle size={30} onClick={() => updateSettings({ autoplay, status: 'play' })} />
              </>
            ) : (
              <>
                PAUSE <PauseCircle size={30} onClick={() => updateSettings({ autoplay, status: 'pause' })} />
              </>
            )}
          </Row>
          <Row
            width="auto"
            css={`
              gap: 0.5rem;
            `}
            onClick={() => updateSettings({ autoplay: !autoplay, status })}
          >
            AUTOPLAY {!autoplay ? <ToggleLeft size={40} fill="red" /> : <ToggleRight size={40} fill="green" />}
          </Row>
        </Row>
      </Row>
    </ShowcaseVideoControlContainer>
  )
}
