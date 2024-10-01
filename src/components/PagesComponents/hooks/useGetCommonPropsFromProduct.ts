import { SkillLockStatus } from '@past3lle/forge-web3'
import { useMemo } from 'react'
import { ProductVariantQuery } from '@/shopify/graphql/types'

import { BaseScreensProps } from '../screens/types'
import { BaseProductPageProps } from '../types'

export function useGetCommonPropsFromProduct({
  bgColor,
  color,
  altColor,
  headerLogo,
  logo,
  navLogo,
  title,
  shortDescription,
  variant,
  skillMetadata,
  lockStatus,
  isMobile,
}: Omit<BaseProductPageProps, 'id' | 'sizes' | 'images' | 'videos' | 'description' | 'descriptionHtml'> & {
  variant: ProductVariantQuery['product'] | null | undefined
  lockStatus: SkillLockStatus | null
  isMobile: boolean
}): BaseScreensProps {
  return useMemo(
    () => ({
      isMobile,
      metaContent: {
        headerLogo,
        logo,
        navLogo,
      },
      product: {
        title,
        variant,
        shortDescription,
      },
      skillInfo:
        lockStatus === null
          ? null
          : {
              lockStatus,
              metadata: skillMetadata,
            },
      palette: {
        bgColor,
        color,
        altColor,
      },
    }),
    [
      altColor,
      bgColor,
      color,
      headerLogo,
      isMobile,
      lockStatus,
      logo,
      navLogo,
      shortDescription,
      skillMetadata,
      title,
      variant,
    ],
  )
}
