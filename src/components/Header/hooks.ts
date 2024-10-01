import { useCurrentProductMedia, useGetAllProductThemeMedia } from '@/state/collection/hooks'
import { ShopImageSrcSet } from '@/types'
import { checkIsCollectionPage } from '@/utils/navigation'
import { BLACK } from '@past3lle/theme'
import { getIsMobile } from '@past3lle/utils'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ReturnType {
  headerLogo: ShopImageSrcSet | undefined
  color: string
}
export function useHeaderMedia(): ReturnType {
  const pathname = usePathname() || ''
  const isCollectionPage = checkIsCollectionPage({ pathname })
  const dynamicMediaConfig = useCurrentProductMedia()
  // "randomly" select a product header from collection for header (on mobile collection view ONLY)
  const productMediaList = useGetAllProductThemeMedia()
  const [{ headerLogo, color }, setHeaderAssets] = useState<ReturnType>({ headerLogo: undefined, color: BLACK })
  // Wait for client to be ready to set assets on header as it is SSR
  useEffect(() => {
    if (productMediaList) {
      const randomIndex = Math.floor(Math.random() * productMediaList.length - 1)
      const headerLogo =
        getIsMobile() && isCollectionPage
          ? productMediaList?.[randomIndex]?.headerLogo
          : dynamicMediaConfig?.headerLogoSet
      setHeaderAssets({
        headerLogo,
        color: dynamicMediaConfig?.color ?? BLACK,
      })
    }
    // Can safely ignore here as we only want the media list length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicMediaConfig?.color, dynamicMediaConfig?.headerLogoSet, isCollectionPage, productMediaList?.length])

  return {
    headerLogo,
    color,
  }
}
