import { useState } from 'react'
import styled from 'styled-components/macro'
import { transparentize, lighten } from 'polished'
import { ProductSizes } from 'shopify/graphql/types'
import { DEFAULT_SIZE_SELECTED } from 'constants/config'
import { Row, RowProps } from 'components/Layout'
import { TYPE } from 'theme'

type SizeSelectorProps = Omit<RowProps, 'sizes'> & {
  sizes: ProductSizes[]
  color?: string
}

const SquareSelectDiv = styled(TYPE.black)``
const GridSelect = styled(Row)<Pick<SizeSelectorProps, 'color'>>`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: center;
  background: ${transparentize(0.84, 'black')};
  gap: 1px;
  padding: 1px;

  width: 100%;

  > ${SquareSelectDiv} {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: ${({ theme }) => theme.white};
    padding: 10px 20px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;

    height: 40px;
    flex: 1 1 24%;

    &:hover {
      background-color: ${({ theme, color = theme.white }) => lighten(0.08, color)};
    }

    transition: background-color 0.3s ease-out;
  }
`

export default function SizeSelector({ sizes, ...styleProps }: SizeSelectorProps) {
  const [, setSize] = useState<ProductSizes>(DEFAULT_SIZE_SELECTED)
  const handleSetSize = (size: ProductSizes) => setSize(size)

  return (
    <GridSelect {...styleProps}>
      {sizes.map((size, index) => (
        <SquareSelectDiv key={size + '_' + index} onChange={() => handleSetSize(size)}>
          {size}
        </SquareSelectDiv>
      ))}
    </GridSelect>
  )
}
