import { Text as TYPE } from '@/components/Text'
import { BoxProps } from 'rebass'
import { MoneyV2 } from '@/shopify/graphql/types'
import { formatShopifyCurrency } from '@/utils/formatting'

interface PriceProps {
  price: MoneyV2 | undefined
  styleProps?: BoxProps
}
export function Price({ price, styleProps }: PriceProps) {
  if (!price) return null
  const { amount, currencyCode } = price
  const locale = navigator.language || 'pt-PT'
  return (
    <TYPE.ProductText display="flex" alignItems={'center'} style={{ gap: '0.5rem' }} {...styleProps}>
      {formatShopifyCurrency(amount, { currency: currencyCode, locales: [locale] })}
    </TYPE.ProductText>
  )
}
