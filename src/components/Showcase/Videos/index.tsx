import useModelSizeSelector from '@/components/ModelSizeSelector'
import { SHOWCASE_ENABLED } from '@/constants/flags'
import { ItemVideoContentProps } from '@/components/Asides/skill/ItemVideoContent'
import { CollectionPageProps } from '@/components/PagesComponents/types'
import { memo } from 'react'
import { FragmentProductVideoFragment } from '@/shopify/graphql/types'
import { useGetSelectedProductShowcaseVideo } from '@/state/collection/hooks'
import { useGetShowcaseSettings } from '@/state/user/hooks'

import { ModelInformationOverlay } from './ModelInformationOverlay'
import dynamic from 'next/dynamic'
import { useIsMobile } from '@past3lle/hooks'

const ItemVideoContent = dynamic(
  () =>
    import(
      /* webpackPrefetch: true,  webpackChunkName: "ITEMVIDEOCONTENT" */ '@/components/Asides/skill/ItemVideoContent'
    ),
  { ssr: false },
)

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
  const isMobile = useIsMobile()
  if (hideVideo) return null
  return (
    <>
      {selectedVideo ? (
        <ItemVideoContent
          {...restProps}
          smartFill={
            isMobile
              ? undefined
              : {
                  full: true,
                }
          }
          videos={[selectedVideo]}
          currentCarouselIndex={null}
        />
      ) : (
        fallback
      )}
    </>
  )
}

export default memo(function ShowcaseVideos({ videos, ...restProps }: ShowcaseVideosProps) {
  const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })
  const { size: selectedSize } = useGetShowcaseSettings()
  const { modelSize } = useModelSizeSelector()

  return (
    <SelectedShowcaseVideo
      {...restProps}
      selectedVideo={selectedVideo}
      videoOverlay={
        SHOWCASE_ENABLED && (
          <ModelInformationOverlay
            modelSize={modelSize}
            itemSize={selectedSize}
            isFallback={!!selectedVideo?.isFallback}
          />
        )
      }
    />
  )
})
