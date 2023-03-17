import { SelectedShowcaseVideo, SelectedShowcaseVideoProps } from 'components/Showcase/Videos'
import { Z_INDEXES } from 'constants/config'

export function CarouselShowcaseVideo({
  selectedVideo,
  videoProps,
  ...restProps
}: Omit<SelectedShowcaseVideoProps, 'isMobileWidth'>) {
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
    />
  )
}
