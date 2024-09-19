import { BaseCarouselProps } from '@past3lle/carousel'
import { SmartImageProps, SmartImg } from '@past3lle/components'
import LargeImageCarouselModal, { LargeImageModalStyleProps } from '@/components/Carousel/LargeImageModalCarousel'
import { SmartImgLoader } from '@/components/Loader/SmartImgLoader'
import { STORE_IMAGE_SIZES } from '@/constants/config'
import { ShopImageSrcSet } from '@/types'

interface LargeImageCarouselProps {
  images: ShopImageSrcSet[]
  accentColor: string
  isOpen: boolean
  imageProps?: Omit<SmartImageProps, 'path' | 'pathSrcSet' | 'onClick'>
  modalProps?: Pick<BaseCarouselProps<ShopImageSrcSet[]>, 'dimensions'> & Omit<LargeImageModalStyleProps, 'zoomLevel'>

  toggleModal: () => void
  dismissModal: () => void
}

export function LargeImageCarousel({
  images,
  accentColor,
  isOpen,
  imageProps,
  modalProps,
  toggleModal,
  dismissModal,
}: LargeImageCarouselProps) {
  return (
    <LargeImageCarouselModal
      isOpen={isOpen}
      toggleModal={toggleModal}
      dismissModal={dismissModal}
      containerHeight={modalProps?.containerHeight}
      containerWidth={modalProps?.containerWidth}
      // Carousel props
      data={images}
      axis="x"
      startIndex={0}
      colors={{
        accent: accentColor,
      }}
      imageKit={{
        transformation: [
          {
            width: STORE_IMAGE_SIZES.LARGE,
            height: STORE_IMAGE_SIZES.LARGE,
          },
        ],
      }}
      dimensions={{
        fillContainer: true,
        ...modalProps?.dimensions,
      }}
    >
      {({ index, defaultImageTransforms }) => {
        const { defaultUrl, ...urlRest } = images[index]

        return (
          <SmartImg
            path={{ defaultPath: defaultUrl }}
            pathSrcSet={urlRest}
            transformation={[defaultImageTransforms, ...(imageProps?.transformation || [])]}
            onClick={toggleModal}
            lqImageOptions={{ ...defaultImageTransforms, showLoadingIndicator: true, ...imageProps?.lqImageOptions }}
            placeholderProps={{
              loadingContent: <SmartImgLoader />,
            }}
            {...imageProps}
          />
        )
      }}
    </LargeImageCarouselModal>
  )
}
