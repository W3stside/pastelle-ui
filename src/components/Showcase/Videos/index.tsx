import { ItemVideoContent, ItemVideoContentProps } from 'pages/SingleProduct/ItemVideoContent'
import { CollectionPageProps } from 'pages/common/types'
import { memo } from 'react'
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
      {selectedVideo ? (
        <ItemVideoContent {...restProps} videos={[selectedVideo]} currentCarouselIndex={null} />
      ) : (
        fallback
      )}
    </>
  )
}

export default memo(function ShowcaseVideos({ videos, ...restProps }: ShowcaseVideosProps) {
  const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })

  return <SelectedShowcaseVideo selectedVideo={selectedVideo} {...restProps} />
})
