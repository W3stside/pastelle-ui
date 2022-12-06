import { useMemo } from 'react'
import { ItemVideoContent, ItemVideoContentProps } from 'pages/SingleItem/ItemVideoContent'
import { SingleItemPageProps } from 'pages/SingleItem/AsideWithVideo'
import { useGetShowcaseSettings } from 'state/user/hooks'
import { reduceShopifyMediaToShowcaseVideos } from 'shopify/utils'
import { ShowcaseAlertMessages } from 'components/Common'
import { IS_PRE_PROD } from 'constants/env'

type ShowcaseVideosProps = Pick<SingleItemPageProps, 'firstPaintOver' | 'videos'> &
  ItemVideoContentProps & {
    hideVideo: boolean
  }

export default function ShowcaseVideos({ hideVideo, videos, ...restProps }: ShowcaseVideosProps) {
  const { gender, height, size: selectedSize } = useGetShowcaseSettings()

  const showcaseVideosMap = useMemo(() => videos.reduce(reduceShopifyMediaToShowcaseVideos, {}), [videos])
  const showcaseVideoKey = useMemo(() => `${gender}-${height}-${selectedSize}`, [gender, height, selectedSize])

  return useMemo(() => {
    const hasVideoForSize = !!showcaseVideosMap[showcaseVideoKey]

    return hideVideo ? null : (
      <>
        <ShowcaseAlertMessages>
          {IS_PRE_PROD && <div>PLACEHOLDER VIDEO CONTENT - REAL CONTENT COMING SOON</div>}
        </ShowcaseAlertMessages>
        <ItemVideoContent
          {...restProps}
          videos={hasVideoForSize ? [showcaseVideosMap[showcaseVideoKey]] : videos}
          currentCarouselIndex={null}
        />
      </>
    )
  }, [hideVideo, restProps, showcaseVideoKey, showcaseVideosMap, videos])
}
