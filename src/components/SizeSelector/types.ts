import { RowProps } from '@past3lle/components'
import { ProductOptionsSize, ProductSizes } from '@/shopify/graphql/types'

export type SizeSelectorProps = Omit<RowProps, 'sizes'> & {
  sizes: ProductOptionsSize
  selectedSize: ProductSizes
  color?: string
  handleSizeSelect: (size: ProductSizes) => void
}
