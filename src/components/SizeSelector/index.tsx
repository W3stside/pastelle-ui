import { useCallback } from 'react'
import styled from 'styled-components/macro'
import { transparentize } from 'polished'
import { ProductOptionsSize, ProductSizes } from 'shopify/graphql/types'
import { Row, RowProps } from 'components/Layout'
import { TYPE } from 'theme'
import { BLACK, upToExtraSmall } from 'theme/utils'
import { useGetShowcaseSettings, useUpdateShowcaseSettings } from 'state/user/hooks'

type SizeSelectorProps = Omit<RowProps, 'sizes'> & {
  sizes: ProductOptionsSize
  selectedSize: ProductSizes
  color?: string
  handleSizeSelect: (size: ProductSizes) => void
}

const SquareSelectDiv = styled(TYPE.black)<{ isSelected: boolean; bgColor?: string }>`
  ${({ isSelected, theme }) =>
    isSelected &&
    `
      &&&&& {
        background-color: ${theme.inputHoverColor};
        color: ${theme.offWhite};
        font-weight: 800;
        text-shadow: 0px 0px 3px ${transparentize(0.6, BLACK)};
      }
    `}
`
const GridSelect = styled(Row)<RowProps & Pick<SizeSelectorProps, 'color'>>`
  gap: 1px;
  flex-flow: row wrap;

  background: ${({ theme }) => theme.products.aside.itemContainer};
  border-radius: ${({ theme }) => theme.buttons.borderRadius};
  border: 1px solid ${({ theme }) => theme.products.aside.inputsBorderColor};
  overflow: hidden;

  width: 100%;

  > ${SquareSelectDiv} {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 1rem 2rem;
    text-align: center;
    font-size: 2rem;
    font-weight: 400;
    color: ${({ theme }) => theme.products.aside.textColor};
    height: 5rem;
    flex: 1 1 24%;

    ${upToExtraSmall`
      flex: 1 1 50%;
    `}

    &:hover {
      background-color: ${({ theme }) => transparentize(0.3, theme.inputHoverColor)};
    }

    transition: background-color 0.3s ease-out;
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
    SizeSelector: SizeSelectorMemoed
  }
}
