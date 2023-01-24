import { Row } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import { isMobile } from '@past3lle/utils'
import { ClickCarousel, ProductClickCarousel, SwipeCarousel } from 'components/Carousel/ProductCarousels'
import { MINIMUM_COLLECTION_ITEM_HEIGHT } from 'constants/config'
import Logo from 'pages/common/components/Logo'
import { DEFAULT_MEDIA_START_INDEX } from 'pages/common/constants'
import { ProductAsidePanel, ProductContainer, ProductScreen, ScrollingProductLabel } from 'pages/common/styleds'
import { CollectionPageProps } from 'pages/common/types'
import { useState } from 'react'
import { getImageSizeMap } from 'shopify/utils'
import { useAppSelector } from 'state'
import {
  /* useGetSelectedProductShowcaseVideo, */
  useUpdateCurrentlyViewingProduct,
} from 'state/collection/hooks'

import { CollectionScreensContainer } from './styled'

function WebCarousel(props: Omit<ProductClickCarousel, 'showButtons'>) {
  if (isMobile) return null

  return <ClickCarousel showButtons={false} {...props} />
}

export default function CollectionProductPage({
  id,
  logo,
  title,
  color = '#000',
  handle,
  images = [],
  // videos = [],
  bgColor,
  navLogo,
  isActive,
  itemIndex,
  headerLogo,
  shortDescription,
}: CollectionPageProps) {
  // UPDATE VIEWING WITH WHATEVER ITEM IS CURRENT ON SCREEN
  useUpdateCurrentlyViewingProduct(isActive, { handle, id })

  // CAROUSEL STATE
  const [currentCarouselIndex] = useState(DEFAULT_MEDIA_START_INDEX)
  const Carousel = isMobile ? SwipeCarousel : WebCarousel
  // IMAGES
  const imageUrls = getImageSizeMap(images)
  // SELECTED SHOWCASE VIDEO
  // const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })
  // CONTENT CONTAINER REF FOR DYNAMIC SIZE UPDATING AND CAROUSELS
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)
  // USER VIDEO AUTOPLAY SETTINGS
  const { autoplay: autoPlay } = useAppSelector((state) => state.user.showcase.videoSettings)

  return (
    <>
      <ScrollingProductLabel logo={headerLogo} labelColor={bgColor} flexWrap="wrap">
        <Row justifyContent="space-between" alignItems={'center'} width="100%">
          <strong>{title}</strong>
          <strong>
            VIEWING {itemIndex + 1}/{6}
          </strong>
        </Row>
        <Row>
          <span style={{ fontSize: 'smaller' }}>{shortDescription}</span>
        </Row>
      </ScrollingProductLabel>

      {/* Item content */}
      <ProductContainer id="#item-container" bgColor={color} navLogo={navLogo} logo={logo}>
        <ProductAsidePanel id="#item-aside-panel">
          <CollectionScreensContainer ref={setRef}>
            <ProductScreen>
              {/* Product carousel */}
              <Carousel
                data={isMobile ? [...imageUrls /* , selectedVideo */] : imageUrls}
                startIndex={currentCarouselIndex}
                accentColor={color}
                videoProps={{ autoPlay }}
                fixedSizes={{
                  height: innerContainerRef?.clientHeight || MINIMUM_COLLECTION_ITEM_HEIGHT,
                  width: innerContainerRef?.clientHeight || MINIMUM_COLLECTION_ITEM_HEIGHT,
                }}
                touchAction="none"
              />
              {/* DYNAMIC LOGO */}
              <Logo
                parentNode={innerContainerRef}
                isCollectionView
                logos={{ header: headerLogo, nav: navLogo, main: logo }}
              />
            </ProductScreen>
          </CollectionScreensContainer>
        </ProductAsidePanel>
      </ProductContainer>
    </>
  )
}
