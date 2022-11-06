import { ItemVideoContent, ItemVideoContentProps } from 'pages/SingleItem/ItemVideoContent'
import { SingleItemPageProps } from 'pages/SingleItem/AsideWithVideo'
import { useGetShowcaseSettings } from 'state/user/hooks'
import { FragmentProductVideoFragment, MediaContentType } from 'shopify/graphql/types'
import { sizeToFullSizeCapitalised } from 'shopify/utils'
import { useMemo } from 'react'
import { PreProdLabel } from 'components/Common'

type ShowcaseVideosProps = Pick<SingleItemPageProps, 'firstPaintOver' | 'videos' | 'showcaseVideos'> &
  ItemVideoContentProps & {
    hideVideo: boolean
  }

export default function ShowcaseVideos({ hideVideo, showcaseVideos, videos, ...restProps }: ShowcaseVideosProps) {
  const { gender, height, size: selectedSize } = useGetShowcaseSettings()

  // TOOD: fix/remove
  const isPreProd = process.env.REACT_APP_IS_PRE_PROD || false

  return useMemo(() => {
    // e.g 175-LARGE
    const builtUrlSearchString = height + '-' + sizeToFullSizeCapitalised(selectedSize)
    const showcaseVideosByGender = showcaseVideos
      ? showcaseVideos[gender].reduce(_reduceShowcaseVideo(builtUrlSearchString), [])
      : videos
    return hideVideo ? null : (
      <>
        {isPreProd && <PreProdLabel>PLACEHOLDER VIDEO CONTENT - REAL CONTENT COMING SOON</PreProdLabel>}
        <ItemVideoContent {...restProps} videos={showcaseVideosByGender} />
      </>
    )
  }, [gender, height, hideVideo, isPreProd, restProps, selectedSize, showcaseVideos, videos])
}

const _reduceShowcaseVideo = (builtUrlSearchString: string) => (
  acc: FragmentProductVideoFragment[],
  vidName: string | null
) => {
  if (vidName?.includes(builtUrlSearchString)) {
    acc.push({
      id: vidName,
      mediaContentType: MediaContentType.ExternalVideo,
      sources: [{ __typename: 'VideoSource', url: vidName, mimeType: 'video/mp4' }]
    })
    return acc
  }

  return acc
}
