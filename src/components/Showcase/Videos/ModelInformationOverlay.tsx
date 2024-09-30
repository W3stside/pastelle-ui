import { fromExtraLarge, upToMedium } from '@past3lle/theme'
import { useMemo } from 'react'
import { ProductSizes } from '@/shopify/graphql/types'
import styled from 'styled-components'

const Container = styled.h1<{ isMobile: boolean }>`
  position: absolute;
  bottom: ${(props) => (props.isMobile ? '0.4rem' : '-1rem')};
  right: 0;
  ${(props) => props.isMobile && `left: 21%;`}
  border-radius: ${(props) => (props.isMobile ? '0 60% 0 0' : '1rem 0 0 0')};
  text-align: ${(props) => (props.isMobile ? 'left' : 'left')};
  font-size: 1.2rem;
  padding: ${(props) => (props.isMobile ? '1.5% 0 5% 10%' : '1rem 1.5rem')};
  ${(props) => props.isMobile && `width: 52%;`}
  background-color: rgba(0, 0, 0, 0.6);
  font-variation-settings: 'wght' 100;
  z-index: 100;

  max-width: 44vw;

  ${fromExtraLarge`
    font-size: 1vw;
    bottom: -1vw;
    max-width: 60vw;
  `}

  ${upToMedium`
    max-width: 60vw;
  `}

  > strong {
    font-variation-settings: 'wght' 700;
  }
`

export function ModelInformationOverlay({
  isMobile,
  modelSize,
  itemSize,
  isFallback,
}: {
  isMobile?: boolean
  isFallback?: boolean
  modelSize: number
  itemSize: ProductSizes
}) {
  const content = useMemo(
    () =>
      isFallback ? (
        <>
          No showcase video yet for this size/model combo. <strong>Coming soon</strong>.
        </>
      ) : isMobile ? (
        <>
          <strong>{modelSize}cm </strong>
          -- size: <strong>{itemSize}</strong>
        </>
      ) : (
        <>
          <strong>{modelSize}cm</strong> model wearing <strong>{itemSize}</strong> {'  ----  '} Use showcase settings to
          see different models wearing different sizes!
        </>
      ),
    [isFallback, isMobile, itemSize, modelSize],
  )
  return <Container isMobile={!!isMobile}>{content}</Container>
}
