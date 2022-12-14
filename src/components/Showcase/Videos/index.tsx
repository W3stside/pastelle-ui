import { useMemo } from 'react'
import { ItemVideoContent, ItemVideoContentProps } from 'pages/SingleItem/ItemVideoContent'
import { SingleItemPageProps } from 'pages/SingleItem/AsideWithVideo'
import { useGetShowcaseSettings } from 'state/user/hooks'
import { reduceShopifyMediaToShowcaseVideos } from 'shopify/utils'
import { ShowcaseAlertMessages } from 'components/Common'
import { IS_PRE_PROD } from 'constants/env'
import { isMobile } from 'utils'

type ShowcaseVideosProps = Pick<SingleItemPageProps, 'firstPaintOver' | 'videos'> &
  ItemVideoContentProps & {
    hideVideo: boolean
  }

export default function ShowcaseVideos({ hideVideo, videos, ...restProps }: ShowcaseVideosProps) {
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

  return useMemo(() => {
    const sizeVideo = videoMap[isMobile ? mobileKey : webKey] || videoMap[webKey]

    return hideVideo ? null : (
      <>
        <ShowcaseAlertMessages>
          {IS_PRE_PROD && <div>PLACEHOLDER VIDEO CONTENT - REAL CONTENT COMING SOON</div>}
        </ShowcaseAlertMessages>
        <ItemVideoContent
          {...restProps}
          videos={sizeVideo ? [sizeVideo] : videos.slice(0, 1)}
          currentCarouselIndex={null}
        />
      </>
    )
  }, [hideVideo, mobileKey, restProps, videoMap, videos, webKey])
}
