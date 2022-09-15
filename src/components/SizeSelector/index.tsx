import React, { useCallback, useState } from 'react'
import styled from 'styled-components/macro'
import { transparentize } from 'polished'
import { ProductOptionsSize, ProductSizes } from 'shopify/graphql/types'
import { DEFAULT_SIZE_SELECTED } from 'constants/config'
import { Row, RowProps } from 'components/Layout'
import { TYPE } from 'theme'
import { BLACK, OFF_WHITE, setBestContrastingColour } from 'theme/utils'

type SizeSelectorProps = Omit<RowProps, 'sizes'> & {
  sizes: ProductOptionsSize
  selectedSize: ProductSizes
  color?: string
  handleSizeSelect: (size: ProductSizes) => void
}

const SquareSelectDiv = styled(TYPE.black)<{ isSelected: boolean; bgColor?: string }>`
  ${({ isSelected, theme, bgColor = theme.white }) =>
    isSelected &&
    `
      &&&&& {
        background-color: ${transparentize(0.3, bgColor)};
        color: ${setBestContrastingColour({
          bgColour: bgColor,
          fgColour: BLACK,
          lightColour: OFF_WHITE,
          darkColour: BLACK
        })};
        font-weight: 800;
        text-shadow: 0px 0px 3px ${transparentize(0.6, BLACK)};
      }
    `}
`
const GridSelect = styled(Row)<Pick<SizeSelectorProps, 'color'>>`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: center;
  gap: 1px;
  padding: 1px;

  width: 100%;

  > ${SquareSelectDiv} {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: ${({ theme }) => theme.offWhite};
    padding: 1rem 2rem;
    text-align: center;
    font-size: 2rem;
    font-weight: 400;

    height: 5rem;
    flex: 1 1 24%;

    &:hover {
      background-color: ${({ theme, color = theme.white }) => transparentize(0.7, color)};
    }

    transition: background-color 0.3s ease-out;
  }
`

function SizeSelector({ sizes, selectedSize, handleSizeSelect, ...styleProps }: SizeSelectorProps) {
  return (
    <GridSelect {...styleProps}>
      {sizes.map((size, index) => (
        <SquareSelectDiv
          key={size + '_' + index}
          bgColor={styleProps.color}
          isSelected={selectedSize === size}
          onClick={() => handleSizeSelect(size as ProductSizes)}
        >
          {size}
        </SquareSelectDiv>
      ))}
    </GridSelect>
  )
}

export default function useSizeSelector({ sizes }: Pick<SizeSelectorProps, 'sizes'>) {
  const [selectedSize, setSize] = useState<ProductSizes>(DEFAULT_SIZE_SELECTED)
  const handleSetSize = useCallback((size: ProductSizes) => {
    setSize(size)
  }, [])

  const SizeSelectorMemoed = useCallback(
    (props: Omit<SizeSelectorProps, 'selectedSize' | 'sizes' | 'handleSizeSelect'>) => (
      <SizeSelector {...props} selectedSize={selectedSize} sizes={sizes} handleSizeSelect={handleSetSize} />
    ),
    [handleSetSize, selectedSize, sizes]
  )

  return {
    selectedSize,
    SizeSelector: SizeSelectorMemoed
  }
}
