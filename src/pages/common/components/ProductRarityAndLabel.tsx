import { Column, Row } from '@past3lle/components'
import { RarityLabel } from 'components/Rarity/Label'
import { Text as TYPE } from 'components/Text'
import { LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import { darken, transparentize } from 'polished'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'

import { BaseProductPageProps } from '../types'

export default function ProductRarityAndLabel({
  color,
  title,
  shortDescription,
  variant,
}: Pick<BaseProductPageProps, 'title' | 'shortDescription' | 'color'> & {
  variant: ReturnType<typeof useQueryProductVariantByKeyValue>
}) {
  const skillMetadata: Record<string, any> | null = JSON.parse(
    variant?.variantBySelectedOptions?.product.skillMetadata?.value || 'null'
  )
  return (
    <Row
      alignItems={'center'}
      justifyContent="space-evenly"
      padding="1rem"
      maxHeight={LAYOUT_REM_HEIGHT_MAP.PRICE_LABEL + 'rem'}
    >
      <Column maxWidth={'60%'}>
        <TYPE.ProductText fontSize="2rem" fontWeight={200}>
          {title}
        </TYPE.ProductText>
        <TYPE.ProductText>{shortDescription}</TYPE.ProductText>
      </Column>
      {skillMetadata && (
        <RarityLabel
          buttonLabel="VIEW SKILL"
          metadata={skillMetadata}
          styleProps={{
            fontWeight: 300,
            fontSize: '2rem',
            margin: 'auto 0 0 auto',
            padding: '0.5rem',
            flex: '0 1 auto',
            maxWidth: '40%',
            backgroundColor: darken(0.13, transparentize(0.2, color)),
          }}
        />
      )}
    </Row>
  )
}
