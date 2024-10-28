import styled from 'styled-components/macro'

import { PNG_LogoCircle_2x } from '@past3lle/assets'
import { Row } from '@past3lle/components'
import { Text } from '../Text'

interface ToastProps {
  header: string
  body: string
  isMobile: boolean
}

export function PastelleToast({ header, body, isMobile }: ToastProps) {
  return (
    <ToastContainer isMobile={isMobile}>
      <Text.Main>{header}</Text.Main>
      <Row>
        <img src={PNG_LogoCircle_2x} />
        <Text.ProductText backgroundColor="#6495edb3">{body}</Text.ProductText>
      </Row>
    </ToastContainer>
  )
}

const ToastContainer = styled.div<{ isMobile: boolean }>`
  > ${Text.Main} {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: ghostwhite;
  }
  img {
    width: ${(props) => (props.isMobile ? '12%' : '20%')};
    height: auto;
    margin-right: 1rem;
  }

  ${Row} > div {
    color: ghostwhite;
    font-weight: 900;
    border-radius: 3px;
    padding: 1px 8px;
    width: auto;
    font-size: ${(props) => (props.isMobile ? '3.5rem' : '2.5rem')};
  }
`
