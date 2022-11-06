import { ItemVideoContent, ItemVideoContentProps } from 'pages/SingleItem/ItemVideoContent'
import { SingleItemPageProps } from 'pages/SingleItem/AsideWithVideo'
import { useGetShowcaseSettings } from 'state/user/hooks'
import { FragmentProductVideoFragment, MediaContentType, ProductSizes } from 'shopify/graphql/types'
import { sizeToFullSizeCapitalised } from 'shopify/utils'
import { useMemo } from 'react'
import { ShowcaseAlertMessages } from 'components/Common'
import { IS_PRE_PROD } from 'constants/env'

type ShowcaseVideosProps = Pick<SingleItemPageProps, 'firstPaintOver' | 'videos' | 'showcaseVideos'> &
  ItemVideoContentProps & {
    hideVideo: boolean
  }

export default function ShowcaseVideos({ hideVideo, showcaseVideos, videos, ...restProps }: ShowcaseVideosProps) {
  const { gender, height, size: selectedSize } = useGetShowcaseSettings()

  return useMemo(() => {
    const nextRelatedSize = _getNextRelatedProductSize(selectedSize)
    // e.g 175-LARGE
    const [builtUrlSearchString, relatedSizeBuiltUrlSearchString] = [
      height + '-' + sizeToFullSizeCapitalised(selectedSize),
      height + '-' + sizeToFullSizeCapitalised(nextRelatedSize)
    ]

    const showcaseVideosByGender = showcaseVideos
      ? showcaseVideos[gender].reduce(_reduceShowcaseVideo(builtUrlSearchString), [])
      : videos

    const hasVideoForSize = !!showcaseVideosByGender?.length

    // get the video urls for the next relatable size, if necessary
    const nextSizeShowcaseVideosByGender =
      !showcaseVideos || hasVideoForSize
        ? videos
        : showcaseVideos[gender].reduce(_reduceShowcaseVideo(relatedSizeBuiltUrlSearchString), [])

    return hideVideo ? null : (
      <>
        <ShowcaseAlertMessages>
          {IS_PRE_PROD && <div>PLACEHOLDER VIDEO CONTENT - REAL CONTENT COMING SOON</div>}
          {!hasVideoForSize && <div>NO SHOWCASE FOR SELECTED SIZE. VIEWING SIZE &quot;{nextRelatedSize}&quot;</div>}
        </ShowcaseAlertMessages>
        <ItemVideoContent
          {...restProps}
          videos={hasVideoForSize ? showcaseVideosByGender : nextSizeShowcaseVideosByGender}
        />
      </>
    )
  }, [gender, height, hideVideo, restProps, selectedSize, showcaseVideos, videos])
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

function _getNextRelatedProductSize(selectedSize: ProductSizes) {
  switch (selectedSize) {
    case ProductSizes.XL:
      return ProductSizes.L
    case ProductSizes.L:
      return ProductSizes.XL
    case ProductSizes.M:
      return ProductSizes.L
    case ProductSizes.S:
      return ProductSizes.M
  }
}
