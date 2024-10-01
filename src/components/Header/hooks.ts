import { COLLECTION_PATHNAME } from '@/constants/navigation'
import { useCurrentProductMedia, useGetAllProductThemeMedia } from '@/state/collection/hooks'
import { ShopImageSrcSet } from '@/types'
import { BLACK } from '@past3lle/theme'
import { getIsMobile } from '@past3lle/utils'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ReturnType {
  headerLogo: ShopImageSrcSet | undefined
  color: string
}
export function useHeaderMedia(): ReturnType {
  const pathname = usePathname() || '/'
  const currentOnScreenMetaAsset = useCurrentProductMedia(pathname)
  // "randomly" select a product header from collection for header (on mobile collection view ONLY)
  const productsMetaAssetsList = useGetAllProductThemeMedia()
  const [{ headerLogo, color }, setHeaderAssets] = useState<ReturnType>({ headerLogo: undefined, color: BLACK })
  // Wait for client to be ready to set assets on header as it is SSR
  useEffect(() => {
    const isCollectionPage = pathname === COLLECTION_PATHNAME
    const isHomePage = pathname === '/'

    const randomIndex = Math.floor(Math.random() * (productsMetaAssetsList?.length || 0) - 1)
    const headerLogo =
      getIsMobile() && isCollectionPage
        ? productsMetaAssetsList?.[randomIndex]?.headerLogo
        : currentOnScreenMetaAsset?.headerLogoSet
    setHeaderAssets({
      headerLogo,
      color: (isHomePage ? currentOnScreenMetaAsset?.color : currentOnScreenMetaAsset?.color) ?? BLACK,
    })

    // Can safely ignore here as we only want the media list length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentOnScreenMetaAsset?.color,
    currentOnScreenMetaAsset?.headerLogoSet,
    pathname,
    productsMetaAssetsList?.length,
  ])

  return {
    headerLogo,
    color,
  }
}
