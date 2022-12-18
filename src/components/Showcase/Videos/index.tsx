import { ItemVideoContent, ItemVideoContentProps } from 'pages/SingleProduct/ItemVideoContent'
import { CollectionPageProps } from 'pages/common/types'
// import { ShowcaseAlertMessages } from 'components/Common'
// import { IS_PRE_PROD } from 'constants/env'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
import { useGetSelectedProductShowcaseVideo } from 'state/collection/hooks'

export type ShowcaseVideosProps = Pick<CollectionPageProps, 'firstPaintOver' | 'videos'> &
  ItemVideoContentProps & {
    hideVideo: boolean
    fallback?: React.ReactNode
  }
export type SelectedShowcaseVideoProps = Omit<ShowcaseVideosProps, 'videos'> & {
  selectedVideo: FragmentProductVideoFragment
}
export function SelectedShowcaseVideo({
  selectedVideo,
  fallback,
  hideVideo,
  ...restProps
}: SelectedShowcaseVideoProps) {
  if (hideVideo) return null
  return (
    <>
      {/* <ShowcaseAlertMessages></ShowcaseAlertMessages> */}
      {selectedVideo ? (
        <ItemVideoContent {...restProps} videos={[selectedVideo]} currentCarouselIndex={null} />
      ) : (
        fallback
      )}
    </>
  )
}

export default function ShowcaseVideos({ videos, ...restProps }: ShowcaseVideosProps) {
  const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })

  return <SelectedShowcaseVideo selectedVideo={selectedVideo} {...restProps} />
}
