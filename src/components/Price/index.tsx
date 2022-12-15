import { TYPE } from 'theme'
import { formatCurrency } from 'utils/formatting'

export function Price({ price, bgColor, ...boxProps }: any) {
  if (!price) return null
  const { amount, currencyCode } = price
  return (
    <TYPE.productText
      display="flex"
      alignItems={'center'}
      backgroundColor={bgColor}
      style={{ gap: '0.5rem' }}
      {...boxProps}
    >
      {formatCurrency(amount, currencyCode)}
    </TYPE.productText>
  )
}
