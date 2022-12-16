import { Row, Column } from 'components/Layout'
import { Price } from 'components/Price'
import { darken, transparentize } from 'polished'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'
import { TYPE } from 'theme'
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
    <Row alignItems={'center'} justifyContent="space-evenly" padding="1rem">
      <Column maxWidth={'60%'}>
        <TYPE.productText fontSize="3rem" fontWeight={200}>
          {title}
        </TYPE.productText>
        <TYPE.productText>{shortDescription}</TYPE.productText>
      </Column>
      {/* VARIANT PRICE */}
      <Price
        price={variant?.variantBySelectedOptions?.priceV2}
        fontWeight={300}
        fontSize={'2rem'}
        margin={'auto 0 0 auto'}
        padding={'0.5rem'}
        flex="0 1 auto"
        maxWidth="40%"
        bgColor={darken(0.13, transparentize(0.2, color))}
      />
    </Row>
  )
}
