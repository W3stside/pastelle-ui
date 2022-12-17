import styled from 'styled-components/macro'
import { ProductSubHeader, SubItemDescription } from 'pages/common/styleds'
import { Z_INDEXES } from 'constants/config'
import { animated, useSpring } from 'react-spring'
import { useDrag, useGesture, useWheel } from '@use-gesture/react'
import { useCallback, useRef, useState } from 'react'
import clamp from 'lodash.clamp'
import { Row } from 'components/Layout'
import { TYPE } from 'theme'
import { X } from 'react-feather'
import Button, { ButtonVariations } from 'components/Button'

const CookieContainer = styled(animated.div)`
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.black};
  z-index: ${Z_INDEXES.COOKIE_BANNER};
  touch-action: none;
  height: 40vh;

  overflow: auto;

  input[type='checkbox'] {
    width: 2rem;
    height: 2rem;
  }
`

export interface CookieProps {
  message: string
  onAcceptParameters?: () => void
  onAcceptStatistic?: () => void
  onAcceptMarketing?: () => void
}
const CookiesText = (props: any) => (
  <TYPE.basic {...props} fontSize={'1.4vw'} display="flex" alignItems={'center'} style={{ gap: '0.5rem' }} />
)
const PASTELLE_COOKIE_SETTINGS = 'PASTELLE_COOKIE_SETTINGS'
// JSON.parse(localStorage.getItem(PASTELLE_COOKIE_POLICY_INTERACTED) || 'false') || false
export default function CookieBanner(props: CookieProps) {
  const storage = localStorage.getItem(PASTELLE_COOKIE_SETTINGS)
  const [isOpen, setBannerOpen] = useState(storage === null || !JSON.parse(storage).interacted)

  const [, setCookieState] = useState({
    interacted: false,
    essential: true,
    statistical: false,
    marketing: false
  })

  const [spring, api] = useSpring(() => ({ y: 0, opacity: 1 }))
  const ref = useRef<HTMLElement | null>(null)

  const onDismiss = useCallback(() => {
    setBannerOpen(false)
  }, [])

  const onSubmit = useCallback(() => {
    setCookieState(state => {
      const next = { ...state, interacted: true }
      localStorage.setItem(PASTELLE_COOKIE_SETTINGS, JSON.stringify(next))
      return next
    })
    onDismiss()
  }, [onDismiss])

  useGesture(
    {
      onDrag: ({ movement: [, my], offset: [, oy], velocity: [, vy], cancel }) => {
        if (my) {
          if (Math.abs(my) > 150 || vy > 0.25) {
            cancel()
            onDismiss()
          }

          api.start({
            y: -oy,
            opacity: clamp(Math.abs((1 / my) * 50), 0, 1)
          })
        }
      }
    },
    { target: ref }
  )

  return isOpen ? (
    <CookieContainer style={spring} ref={ref as any}>
      <X onClick={onDismiss} cursor="pointer" style={{ position: 'absolute', right: 0, margin: '3rem 3rem 0 0' }} />
      <ProductSubHeader fontSize={'3vw'} marginBottom={0} fontWeight={500}>
        {props.message}
      </ProductSubHeader>
      <SubItemDescription fontSize={'1.6vw'} fontWeight={100}>
        C-C-C-COOKIES?
      </SubItemDescription>
      <Row width="100%" gap="1rem" alignItems="center" justifyContent={'space-evenly'}>
        <CookiesText>
          ESSENTIALS
          <input checked disabled type="checkbox" />
        </CookiesText>
        <CookiesText>
          STATESTICAL
          <input
            type="checkbox"
            onChange={e => setCookieState(state => ({ ...state, statistical: !!e.target.value }))}
          />
        </CookiesText>
        <CookiesText>
          MARKETING
          <input type="checkbox" onChange={e => setCookieState(state => ({ ...state, marketing: !!e.target.value }))} />
        </CookiesText>
      </Row>
      <Button variant={ButtonVariations.SUCCESS} onClick={onSubmit} padding={'1rem'} margin="2rem">
        <CookiesText>SAVE AND CLOSE</CookiesText>
      </Button>
    </CookieContainer>
  ) : null
}
