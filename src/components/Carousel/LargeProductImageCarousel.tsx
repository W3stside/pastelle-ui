import LargeImageCarouselModal from 'components/Carousel/common/components/LargeImageModalCarousel'
import SmartImg, { SmartImageProps } from 'components/SmartImg'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { GenericImageSrcSet } from 'shopify/graphql/types'

interface LargeImageCarouselProps {
  images: GenericImageSrcSet[]
  accentColor: string
  isOpen: boolean
  imageProps: Omit<SmartImageProps, 'path' | 'pathSrcSet' | 'transformation' | 'onClick'>

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
      {({ index, imageTransformations }) => {
        const { defaultUrl, ...urlRest } = images[index]

        return (
          <SmartImg
            path={{ defaultPath: defaultUrl }}
            pathSrcSet={urlRest}
            transformation={imageTransformations}
            onClick={toggleModal}
            {...imageProps}
          />
        )
      }}
    </LargeImageCarouselModal>
  )
}
