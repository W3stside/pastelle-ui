import styled from 'styled-components/macro'
import { Row } from 'components/Layout'
import useQuantitySelector, { QuantitySelectorWrapper } from 'hooks/useQuantitySelector'
import AddToCartButton, { AddToCartButtonParams } from 'components/AddToCartButton'

const Wrapper = styled(Row)`
  width: 100%;
  gap: 10px;
  flex-flow: row wrap;

  > button {
    flex: 1 1 65%;
  }
  > ${QuantitySelectorWrapper} {
    flex: 1 1 33%;
    padding: 1rem;
    justify-content: center;
    > button {
      border: none;
      border-radius: 0.5rem;
      margin: 0 0.5rem;
      background: ${({ theme }) => theme.black};
      color: ${({ theme }) => theme.offWhite};
      min-width: 3rem;
    }
    > button,
    > input {
      height: 100%;
      font-weight: 700;
      font-size: 1.6rem;
    }
    > input[type='number'] {
      width: 5rem;
    }
  }
`
export default function AddToCartButtonAndQuantitySelector({
  merchandiseId
}: Pick<AddToCartButtonParams, 'merchandiseId'>) {
  const { quantity, QuantitySelector } = useQuantitySelector()

  return (
    <Wrapper>
      <AddToCartButton merchandiseId={merchandiseId} quantity={quantity} />
      <QuantitySelector />
    </Wrapper>
  )
}
