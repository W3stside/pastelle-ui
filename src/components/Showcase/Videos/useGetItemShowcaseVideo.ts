import { isMobile } from '@past3lle/utils'
import { useMemo } from 'react'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
import { reduceShopifyMediaToShowcaseVideos } from 'shopify/utils'
import { useGetShowcaseSettings } from 'state/user/hooks'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'

export default function useGetProductShowcaseVideos({ videos }: { videos: FragmentProductVideoFragment[] }) {
  const { gender, height, size: selectedSize } = useGetShowcaseSettings()
  const isMobileWidth = useIsMobileWindowWidthSize()

  const { videoMap, webKey, mobileKey } = useMemo(
    () => ({
      videoMap: videos.reduce(reduceShopifyMediaToShowcaseVideos, {}),
      webKey: `${gender}-${height}-${selectedSize}`,
      get mobileKey() {
        return this.webKey + '-MOBILE'
      }
    }),
    [gender, height, selectedSize, videos]
  )

  return useMemo(
    () => videoMap[isMobile || isMobileWidth ? mobileKey : webKey] || videoMap[webKey],
    [mobileKey, videoMap, webKey, isMobileWidth]
  )
}
