'use client'

import { Row } from '@past3lle/components'
import { SkillLockStatus, useW3UserConnectionInfo } from '@past3lle/forge-web3'
import { useIsMobile, useStateRef } from '@past3lle/hooks'
import { MINIMUM_COLLECTION_ITEM_HEIGHT } from '@/constants/config'
import { FORGE_WEB3_ENABLED } from '@/constants/flags'
import { DEFAULT_MEDIA_START_INDEX } from '@/components/pages-common/constants'
import { useGetCommonPropsFromProduct } from '@/components/pages-common/hooks/useGetCommonPropsFromProduct'
import { ProductAsidePanel, ProductContainer, ScrollingProductLabel } from '@/components/pages-common/styleds'
import { CollectionPageProps } from '@/components/pages-common/types'
import { useMemo, useState } from 'react'
import { getImageSizeMap } from '@/shopify/utils'
import { useAppSelector } from '@/state'
import {
  useCurrentCollection,
  useGetSelectedProductShowcaseVideo,
  useUpdateCurrentlyViewingProduct,
} from '@/state/collection/hooks'
import { useThemeManager } from '@/state/user/hooks'
import { defaultThemeColours } from '@/theme'

import { CollectionScreensContainer } from './styled'
import dynamic from 'next/dynamic'
import { BLACK } from '@past3lle/theme'

const AsideCarousel = dynamic(
  () =>
    import(
      /* webpackPrefetch: true,  webpackChunkName: "ASIDECAROUSEL" */ '@/components/pages-common/screens/AsideCarousel'
    )
)

export default function CollectionProductPage(props: CollectionPageProps) {
  const {
    id,
    logo,
    title,
    color = '#000',
    handle,
    images = [],
    lockedImages = [],
    videos = [],
    bgColor,
    navLogo,
    isActive,
    itemIndex,
    headerLogo,
    shortDescription,
    lockStatus,
    // Optional props passed from the ScrollableContentPage (carousel)
    dimensions,
    carousel,
  } = props
  // UPDATE VIEWING WITH WHATEVER ITEM IS CURRENT ON SCREEN
  useUpdateCurrentlyViewingProduct(isActive, { handle, id })

  // CAROUSEL STATE
  const [currentCarouselIndex] = useState(DEFAULT_MEDIA_START_INDEX)
  // SELECTED SHOWCASE VIDEO
  const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })
  // CONTENT CONTAINER REF FOR DYNAMIC SIZE UPDATING AND CAROUSELS
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)
  // USER VIDEO AUTOPLAY SETTINGS
  const { autoplay: autoPlay } = useAppSelector((state) => state.user.showcase.videoSettings)

  // COLLECTION SIZE (for scrolling product label)
  const { collection } = useCurrentCollection()
  const collectionSize = collection ? Object.keys(collection.products).length : 0

  const isMobile = useIsMobile()
  const commonProps = useGetCommonPropsFromProduct({ ...props, isMobile, variant: undefined, lockStatus })

  const { mode } = useThemeManager()

  // USER BLOCKCHAIN INFO
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { address } = (FORGE_WEB3_ENABLED && useW3UserConnectionInfo()) || { address: undefined }

  // Src-set of all images
  const imageSrcSet = useMemo(
    () => getImageSizeMap(lockStatus === SkillLockStatus.LOCKED ? lockedImages : images),
    [lockedImages, lockStatus, images]
  )
  return (
    <>
      <ScrollingProductLabel logo={headerLogo} labelColor={bgColor || BLACK} flexWrap="wrap">
        <Row justifyContent="space-between" alignItems={'center'} width="100%">
          <strong>
            {title}
            {lockedImages?.[0]?.url && (
              <span id="locked-skill-label" style={{ color: defaultThemeColours.red1, marginLeft: '1rem' }}>
                [SKILL LOCKED]
              </span>
            )}
          </strong>
          <strong>
            VIEWING {itemIndex + 1}/{collectionSize}
          </strong>
        </Row>
        <Row>
          <span style={{ fontSize: 'smaller' }}>{shortDescription}</span>
        </Row>
      </ScrollingProductLabel>

      {/* Item content */}
      <ProductContainer id="#item-container" bgColor={color || BLACK} navLogo={navLogo} logo={logo}>
        <ProductAsidePanel id="#item-aside-panel">
          <CollectionScreensContainer ref={setRef}>
            <AsideCarousel
              {...commonProps}
              carousel={{
                ...carousel,
                data: isMobile ? [...imageSrcSet, selectedVideo] : imageSrcSet,
                touchAction: 'none',
                startIndex: currentCarouselIndex,
                videoProps: {
                  autoPlay,
                },
                dimensions: {
                  fixedSizes: {
                    height:
                      dimensions?.fixedSizes?.fixedHeight ||
                      innerContainerRef?.clientHeight ||
                      MINIMUM_COLLECTION_ITEM_HEIGHT,
                    width:
                      dimensions?.fixedSizes?.fixedWidth ||
                      innerContainerRef?.clientHeight ||
                      MINIMUM_COLLECTION_ITEM_HEIGHT,
                  },
                },
              }}
              themeMode={mode}
              breadcrumbs={null}
              containerNode={innerContainerRef}
              userAddress={address}
              hidePrice
              isCollectionView
            />
          </CollectionScreensContainer>
        </ProductAsidePanel>
      </ProductContainer>
    </>
  )
}
