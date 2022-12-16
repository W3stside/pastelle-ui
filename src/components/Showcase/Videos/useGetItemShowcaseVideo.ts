import { useMemo } from 'react'
import { isMobile } from 'utils'
import { reduceShopifyMediaToShowcaseVideos } from 'shopify/utils'
import { useGetShowcaseSettings } from 'state/user/hooks'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'

export default function useGetProductShowcaseVideos({ videos }: { videos: FragmentProductVideoFragment[] }) {
  const { gender, height, size: selectedSize } = useGetShowcaseSettings()

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

  return useMemo(() => videoMap[isMobile ? mobileKey : webKey] || videoMap[webKey], [mobileKey, videoMap, webKey])
}
