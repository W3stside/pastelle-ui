import { Column, Row } from '@past3lle/components'
import { Price } from 'components/Price'
import { Text as TYPE } from 'components/Text'
import { LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import { darken, transparentize } from 'polished'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'

import { BaseProductPageProps } from '../types'

export default function ProductPriceAndLabel({
  color,
  title,
  shortDescription,
  variant
}: Pick<BaseProductPageProps, 'title' | 'shortDescription' | 'color'> & {
  variant: ReturnType<typeof useQueryProductVariantByKeyValue>
}) {
  return (
    <Row
      alignItems={'center'}
      justifyContent="space-evenly"
      padding="1rem"
      maxHeight={LAYOUT_REM_HEIGHT_MAP.PRICE_LABEL + 'rem'}
    >
      <Column maxWidth={'60%'}>
        <TYPE.ProductText fontSize="3rem" fontWeight={200}>
          {title}
        </TYPE.ProductText>
        <TYPE.ProductText>{shortDescription}</TYPE.ProductText>
      </Column>
      {/* VARIANT PRICE */}
      <Price
        price={variant?.variantBySelectedOptions?.priceV2}
        fontWeight={300}
        fontSize={'3rem'}
        margin={'auto 0 0 auto'}
        padding={'0.5rem'}
        flex="0 1 auto"
        maxWidth="40%"
        bgColor={darken(0.13, transparentize(0.2, color))}
      />
    </Row>
  )
}
