import { ProductSizes } from '@/shopify/graphql/types'
import { GridSelect, SquareSelectDiv } from './styled'
import { SizeSelectorProps } from './types'

export function SizeSelector({ sizes, selectedSize, handleSizeSelect, ...styleProps }: SizeSelectorProps) {
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
