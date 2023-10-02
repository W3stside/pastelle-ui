import { ProductSizes } from 'shopify/graphql/types'
import styled from 'styled-components/macro'

const Container = styled.h1`
  position: absolute;
  bottom: -1rem;
  right: 0;
  border-radius: 1rem 0 0 0;
  text-align: left;
  font-size: 1rem;
  padding: 1rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.6);
  font-variation-settings: 'wght' 100;
  z-index: 100;

  > strong {
    font-variation-settings: 'wght' 700;
  }
`

export function ModelInformationOverlay({ modelSize, itemSize }: { modelSize: number; itemSize: ProductSizes }) {
  return (
    <Container>
      <strong>{modelSize}cm</strong> model wearing <strong>{itemSize}</strong> {'  ----  '} Use showcase settings to see
      different models wearing different sizes!
    </Container>
  )
}
