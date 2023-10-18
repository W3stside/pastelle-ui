import useModelSizeSelector from 'components/ModelSizeSelector'
import { SelectedShowcaseVideo, SelectedShowcaseVideoProps } from 'components/Showcase/Videos'
import { ModelInformationOverlay } from 'components/Showcase/Videos/ModelInformationOverlay'
import { SHOWCASE_ENABLED, Z_INDEXES } from 'constants/config'
import { useGetShowcaseSettings } from 'state/user/hooks'

export function CarouselShowcaseVideo({
  selectedVideo,
  videoProps,
  ...restProps
}: Omit<SelectedShowcaseVideoProps, 'isMobileWidth'>) {
  const { size: selectedSize } = useGetShowcaseSettings()
  const { modelSize } = useModelSizeSelector()
  return (
    <SelectedShowcaseVideo
      {...restProps}
      selectedVideo={selectedVideo}
      videoProps={{
        ...videoProps,
        style: {
          cursor: 'pointer',
        },
      }}
      zIndex={Z_INDEXES.PRODUCT_VIDEOS}
      height={'100%'}
      margin="0 0 2rem"
      title="Tap to play/pause"
      isMobileWidth
      videoOverlay={
        SHOWCASE_ENABLED && <ModelInformationOverlay isMobile modelSize={modelSize} itemSize={selectedSize} />
      }
      loadInViewOptions={{
        threshold: 0.01,
        // @ts-ignore
        delay: 500,
        continuous: true,
      }}
    />
  )
}
