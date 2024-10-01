import { Column, Row } from '@past3lle/components'
import { SkillLockStatus, SkillMetadata, useForgeMetadataMapReadAtom } from '@past3lle/forge-web3'
import { SUPPORTED_CHAINS_BY_ENV } from '@/blockchain/provider/config'
import { RarityLabel } from '@/components/Rarity/Label'
import { Text as TYPE } from '@/components/Text'
import { LAYOUT_REM_HEIGHT_MAP } from '@/constants/sizes'
// import { darken, transparentize } from 'polished'
import { useMemo } from 'react'
import { useQueryProductVariantByKeyValue } from '@/shopify/graphql/hooks'
import { shortenShopifyId } from '@/shopify/utils'
import { useTheme } from 'styled-components/macro'

import { BaseProductPageProps } from '../types'

export default function ProductRarityAndLabel({
  // color,
  title,
  shortDescription,
  lockStatus,
  variant,
}: Pick<BaseProductPageProps, 'title' | 'shortDescription'> & {
  variant: ReturnType<typeof useQueryProductVariantByKeyValue>
  color?: string | null
  lockStatus: SkillLockStatus
}) {
  const chain = SUPPORTED_CHAINS_BY_ENV[0]
  const [metadataMap] = useForgeMetadataMapReadAtom(chain?.id)
  const skillMetadata: SkillMetadata | null = useMemo(() => {
    const metadataAsList = Object.values(metadataMap || {})
    const variantShopifyId = shortenShopifyId(variant?.id, 'Product')

    return metadataAsList.find((item) => item.properties.shopifyId === variantShopifyId) ?? null
  }, [metadataMap, variant?.id])

  const skillProperties = useMemo(() => {
    const props = _getSkillLockStatusProperties(lockStatus)

    return props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillMetadata, lockStatus])

  const theme = useTheme()

  return (
    <Row
      alignItems={'center'}
      justifyContent="space-evenly"
      padding="1rem"
      maxHeight={LAYOUT_REM_HEIGHT_MAP.PRICE_LABEL + 'rem'}
      backgroundColor={skillProperties?.bgColor}
    >
      <Column maxWidth="60%" marginRight="auto">
        <TYPE.ProductText fontSize="2rem" fontWeight={200}>
          {title}
        </TYPE.ProductText>
        <TYPE.ProductText>{shortDescription}</TYPE.ProductText>
      </Column>
      {skillMetadata && (
        <RarityLabel
          buttonLabel="VIEW SKILL"
          metadata={skillMetadata}
          chain={chain}
          styleProps={{
            fontWeight: 100,
            letterSpacing: -1.75,
            fontSize: '2rem',
            margin: 'auto 0 auto auto',
            padding: '0.5rem 1rem',
            flex: '0 1 auto',
            maxWidth: '40%',
            backgroundColor: theme.rarity[skillMetadata.properties.rarity].backgroundColor, // darken(0.13, transparentize(0.2, color || skillProperties?.color)),
          }}
        />
      )}
    </Row>
  )
}

function _getSkillLockStatusProperties(lockStatus: SkillLockStatus) {
  return lockStatus === SkillLockStatus.LOCKED
    ? { bgColor: '#cd5c5c', color: '#a9a9a9' }
    : SkillLockStatus.UNLOCKABLE_IN_STORE
      ? { bgColor: '#2e8b57', color: '#2e8b57' }
      : // SkillLockStatus.OWNED
        { bgColor: '#2e8b57', color: '#2e8b57' }
}
