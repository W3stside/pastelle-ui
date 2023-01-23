import { formatCurrency } from '@past3lle/utils'
import { Text as TYPE } from 'components/Text'

export function Price({ price, bgColor, ...boxProps }: any) {
  if (!price) return null
  const { amount, currencyCode } = price
  return (
    <TYPE.ProductText
      display="flex"
      alignItems={'center'}
      backgroundColor={bgColor}
      style={{ gap: '0.5rem' }}
      {...boxProps}
    >
      {formatCurrency(amount, currencyCode)}
    </TYPE.ProductText>
  )
}
