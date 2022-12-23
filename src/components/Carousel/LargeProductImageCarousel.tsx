import LargeImageCarouselModal from 'components/Carousel/common/components/LargeImageModalCarousel'
import SmartImg, { SmartImageProps } from 'components/SmartImg'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { GenericImageSrcSet } from 'utils/types'

interface LargeImageCarouselProps {
  images: GenericImageSrcSet[]
  accentColor: string
  isOpen: boolean
  imageProps?: Omit<SmartImageProps, 'path' | 'pathSrcSet' | 'onClick'>

  toggleModal: () => void
  dismissModal: () => void
}

export function LargeImageCarousel({
  images,
  accentColor,
  isOpen,
  imageProps,
  toggleModal,
  dismissModal
}: LargeImageCarouselProps) {
  return (
    <LargeImageCarouselModal
      isOpen={isOpen}
      toggleModal={toggleModal}
      dismissModal={dismissModal}
      // Carousel props
      accentColor={accentColor}
      data={images}
      transformation={[
        {
          width: STORE_IMAGE_SIZES.LARGE,
          height: STORE_IMAGE_SIZES.LARGE
        }
      ]}
      fixedSizes={undefined}
      startIndex={0}
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
            {...imageProps}
          />
        )
      }}
    </LargeImageCarouselModal>
  )
}
