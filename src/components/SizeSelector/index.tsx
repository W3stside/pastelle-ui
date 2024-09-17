import { Row, RowProps } from '@past3lle/components'
import { BLACK, setBestTextColour, upToExtraSmall } from '@past3lle/theme'
import { Text as TYPE } from 'components/Text'
import { transparentize } from 'polished'
import { useCallback } from 'react'
import { ProductOptionsSize, ProductSizes } from 'shopify/graphql/types'
import { useGetShowcaseSettings, useUpdateShowcaseSettings } from 'state/user/hooks'
import styled from 'styled-components/macro'

type SizeSelectorProps = Omit<RowProps, 'sizes'> & {
  sizes: ProductOptionsSize
  selectedSize: ProductSizes
  color?: string
  handleSizeSelect: (size: ProductSizes) => void
}

const SquareSelectDiv = styled(TYPE.Black)<{ isSelected: boolean; bgColor?: string }>`
  ${({ isSelected, theme, bgColor = theme.content.text }) =>
    isSelected &&
    `
      &&&&& {
        filter: hue-rotate(180deg) saturate(1.5);
        background-color: ${bgColor};
        color: ${setBestTextColour(bgColor, 2, true)};
        font-weight: 800;
        text-shadow: 0px 0px 3px ${transparentize(0.6, BLACK)};
      }
    `}
`
const GridSelect = styled(Row)<RowProps & Pick<SizeSelectorProps, 'color'>>`
  gap: 0.5rem;
  flex-flow: row wrap;

  border-radius: ${({ theme }) => theme.button.border.radius};
  border: 1px solid ${({ theme }) => theme.input.border.colour};
  overflow: hidden;

  width: 100%;

  > ${SquareSelectDiv} {
    background: ${({ color }) => color};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 1rem 2rem;
    text-align: center;
    font-size: 2rem;
    font-weight: 400;
    color: ${({ theme, color = theme.content.text }) => setBestTextColour(color, 2, true)};
    height: 7rem;
    flex: 1 1 24%;

    ${upToExtraSmall`
      flex: 1 1 50%;
    `}

    &:hover {
      filter: hue-rotate(180deg);
    }

    transition: filter 0.3s ease-out;
  }
`

function SizeSelector({ sizes, selectedSize, handleSizeSelect, ...styleProps }: SizeSelectorProps) {
  return (
    <GridSelect justifyContent="space-evenly" alignItems="center" padding="0" {...styleProps}>
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
  const { size: selectedSize } = useGetShowcaseSettings()
  const updateShowcaseSettings = useUpdateShowcaseSettings()
  const handleSetSize = useCallback((size: ProductSizes) => updateShowcaseSettings({ size }), [updateShowcaseSettings])

  const SizeSelectorMemoed = useCallback(
    (props: Omit<SizeSelectorProps, 'selectedSize' | 'sizes' | 'handleSizeSelect'>) => (
      <SizeSelector {...props} selectedSize={selectedSize} sizes={sizes} handleSizeSelect={handleSetSize} />
    ),
    [handleSetSize, selectedSize, sizes]
  )

  return {
    selectedSize,
    SizeSelector: SizeSelectorMemoed,
  }
}
