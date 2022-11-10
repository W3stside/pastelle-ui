import styled from 'styled-components/macro'
import { Row } from 'components/Layout'
import useQuantitySelector, { QuantitySelectorWrapper } from 'hooks/useQuantitySelector'
import AddToCartButton, { AddToCartButtonParams } from 'components/AddToCartButton'
import { useCurrentProductMedia } from 'state/collection/hooks'

const Wrapper = styled(Row)`
  width: 100%;
  gap: 1rem;
  flex-flow: row wrap;

  > button {
    flex: 1 1 65%;
  }
  > ${QuantitySelectorWrapper} {
    flex: 1 1 33%;

    > button {
      width: 5rem;
      font-size: 2.5rem;
    }

    > input[type='number'] {
      width: 7rem;
      border: none;
      border-radius: 0.5rem;
    }
  }
`
export default function AddToCartButtonAndQuantitySelector({
  merchandiseId
}: Pick<AddToCartButtonParams, 'merchandiseId'>) {
  const { quantity, QuantitySelector } = useQuantitySelector({ defaultQuantity: 1 })
  const { color, navLogo } = useCurrentProductMedia()

  return (
    <Wrapper>
      <AddToCartButton
        merchandiseId={merchandiseId}
        quantity={quantity}
        buttonProps={{ bgImage: navLogo, backgroundColor: color || '#000' }}
      />
      <QuantitySelector color={color} />
    </Wrapper>
  )
}
