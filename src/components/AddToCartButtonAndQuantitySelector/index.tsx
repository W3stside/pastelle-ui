import styled from 'styled-components/macro'
import { Row } from 'components/Layout'
import useQuantitySelector, { QuantitySelectorWrapper } from 'hooks/useQuantitySelector'
import AddToCartButton, { AddToCartButtonParams } from 'components/AddToCartButton'

const Wrapper = styled(Row)`
  width: 100%;
  gap: 10px;
  flex-flow: row wrap;

  > button {
    flex: 1 1 60%;
  }
  > ${QuantitySelectorWrapper} {
    flex: 1 1 33%;

    > input[type='number'] {
      width: 5rem;
      border: none;
      border-radius: 0.5rem;
    }
  }
`
export default function AddToCartButtonAndQuantitySelector({
  merchandiseId
}: Pick<AddToCartButtonParams, 'merchandiseId'>) {
  const { quantity, QuantitySelector } = useQuantitySelector({ defaultQuantity: 1 })

  return (
    <Wrapper>
      <AddToCartButton merchandiseId={merchandiseId} quantity={quantity} />
      <QuantitySelector />
    </Wrapper>
  )
}
