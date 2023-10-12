import { SkillLockStatus } from '@past3lle/forge-web3'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'

import { BaseProductPageProps } from '../types'

export interface WithContainerNode {
  containerNode: HTMLElement | null
}
export interface BaseScreensProps {
  isMobile: boolean
  metaContent: Pick<BaseProductPageProps, 'headerLogo' | 'logo' | 'navLogo'>
  palette: Pick<BaseProductPageProps, 'altColor' | 'bgColor' | 'color'>
  product: Pick<BaseProductPageProps, 'shortDescription' | 'title'> & {
    variant: ReturnType<typeof useQueryProductVariantByKeyValue>
  }
  skillInfo: {
    metadata: BaseProductPageProps['skillMetadata']
    lockStatus: SkillLockStatus
  } | null
}
