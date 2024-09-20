import { SkillLockStatus } from '@past3lle/forge-web3'
import { LargeImageCarousel } from '@/components/Carousel/LargeProductImageCarousel'
import { BaseProductPageProps } from '@/pages/common/types'
import { useMemo } from 'react'
import { getImageSizeMap } from '@/shopify/utils'
import { useLargeImageModal, useSizeChartModal } from '@/state/modalsAndPopups/hooks'

type Props = Pick<BaseProductPageProps, 'images' | 'lockedImages' | 'sizeChart' | 'color'> & {
  currentIndex: number
  skillState: SkillLockStatus
  isMobile: boolean
}
export function LargeProductAndSizeChartImagesCarousel({
  color,
  images,
  lockedImages,
  sizeChart,
  currentIndex,
  skillState,
  isMobile,
}: Props) {
  // MODALS
  const {
    isOpen: isLargeProductImageOpen,
    toggleModal: toggleLargeImageModal,
    dismissModal: closeLargeImageModal,
  } = useLargeImageModal()
  const {
    isOpen: isSizeChartOpen,
    toggleModal: toggleSizeChartModal,
    dismissModal: closeSizeChartModal,
  } = useSizeChartModal()
  // PRODUCT/SIZE CHART IMAGES
  const [imageUrls, sizeChartImageUrls] = useMemo(
    () => [getImageSizeMap(skillState === SkillLockStatus.LOCKED ? lockedImages : images), getImageSizeMap(sizeChart)],
    [skillState, images, lockedImages, sizeChart],
  )
  return (
    <>
      {/* Large product images */}
      <LargeImageCarousel
        images={[imageUrls[currentIndex]]}
        accentColor={color}
        isOpen={isLargeProductImageOpen}
        toggleModal={toggleLargeImageModal}
        dismissModal={closeLargeImageModal}
      />
      {/* Size Chart */}
      <LargeImageCarousel
        images={sizeChartImageUrls}
        accentColor={color}
        isOpen={isSizeChartOpen}
        toggleModal={toggleSizeChartModal}
        dismissModal={closeSizeChartModal}
        modalProps={{
          containerHeight: 'auto',
          containerWidth: '90vw',
          dimensions: {
            fillContainer: false,
            fixedSizes: {
              width: Math.floor((window?.innerWidth || 0) * 0.9),
              get height() {
                return Math.floor(isMobile ? Math.min(window.innerHeight / 2, this.width / 1.75) : this.width / 1.75)
              },
            },
          },
        }}
      />
    </>
  )
}
