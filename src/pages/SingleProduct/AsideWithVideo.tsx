import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import { Package, Truck } from 'react-feather'

import { useAppSelector } from 'state'
import useStateRef from 'hooks/useStateRef'
import { useCloseModals, useModalOpen, useToggleModal } from 'state/modalsAndPopups/hooks'
// import { useGetSelectedProductShowcaseVideo } from 'state/collection/hooks'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'
import { ApplicationModal } from 'state/modalsAndPopups/reducer'

import { Column, Row } from 'components/Layout'
import {
  ProductAsidePanel,
  ProductDescription,
  ProductCredits,
  ProductArtistInfo,
  PASTELLE_CREDIT,
  ProductSubHeader,
  HighlightedText,
  FreeShippingBanner,
  ProductBackendDescription
} from 'pages/common/styleds'

import * as StyledElems from 'pages/SingleProduct/styled'

import { useBreadcrumb } from 'components/Breadcrumb'
import useSizeSelector from 'components/SizeSelector'
import useModelSizeSelector from 'components/ModelSizeSelector'
import useShowShowcase from 'components/Showcase/Settings'
import ShowcaseVideos from 'components/Showcase/Videos'
import ShowcaseVideoControls from 'components/Showcase/Videos/Settings'
import AddToCartButton from 'components/AddToCartButton'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { LargeImageCarousel } from 'components/Carousel/LargeProductImageCarousel'
import * as Carousels from 'components/Carousel/ProductCarousels'

import { SingleProductPageProps, WithParentAspectRatio } from 'pages/common/types'
import { DEFAULT_MEDIA_START_INDEX } from 'pages/common/constants'
import ProductPriceAndLabel from 'pages/common/components/ProductPriceAndLabel'
import Logo from 'pages/common/components/Logo'

import { isMobile as isMobileDevice } from 'utils'
import { getImageSizeMap } from 'shopify/utils'
import { FREE_SHIPPING_THRESHOLD, Z_INDEXES } from 'constants/config'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'
import { ProductSwipeCarousel } from 'components/Carousel/ProductCarousels'

export default function SingleProductPage({
  id,
  title,
  logo,
  color = '#000',
  bgColor,
  navLogo,
  headerLogo,
  // media,
  artistInfo,
  sizes = [],
  images = [],
  videos = [],
  description,
  noVideo = false,
  shortDescription,
  parentAspectRatio
}: SingleProductPageProps & WithParentAspectRatio) {
  // MODALS
  const toggleLargeImageModal = useToggleModal(ApplicationModal.ITEM_LARGE_IMAGE)
  const closeModals = useCloseModals()
  const showLargeImage = useModalOpen(ApplicationModal.ITEM_LARGE_IMAGE)

  const { autoplay: autoPlay } = useAppSelector(state => state.user.showcase.videoSettings)

  const isMobileWidth = useIsMobileWindowWidthSize()
  const isMobile = isMobileDevice || isMobileWidth

  // MOBILE/WEB CAROUSEL
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(DEFAULT_MEDIA_START_INDEX)
  const onCarouselChange = (index: number) => setCurrentCarouselIndex(index)
  const Carousel = useCallback(
    (props: Omit<ProductSwipeCarousel, 'touchAction'>) =>
      isMobileDevice ? (
        <Carousels.SwipeCarousel {...props} touchAction="pan-y" />
      ) : (
        <Carousels.ClickCarousel
          {...props}
          showButtons
          onCarouselItemClick={toggleLargeImageModal}
          onCarouselChange={onCarouselChange}
        />
      ),
    [toggleLargeImageModal]
  )

  /// BREADCRUMBS
  const breadcrumbs = useBreadcrumb()

  // IMAGES
  const imageUrls = getImageSizeMap(images)
  // SELECTED SHOWCASE VIDEO
  // const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })

  // CONTENT CONTAINER REF FOR DYNAMIC SIZE UPDATING AND CAROUSELS
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, node => node)

  const { ShowcaseSettings } = useShowShowcase()
  const { SizeSelector, selectedSize } = useSizeSelector({ sizes })
  const { ModelSizeSelector } = useModelSizeSelector()
  const variant = useQueryProductVariantByKeyValue({ productId: id, key: 'Size', value: selectedSize })

  return (
    <>
      <LargeImageCarousel
        images={[imageUrls[currentCarouselIndex]]}
        accentColor={color}
        isOpen={showLargeImage}
        toggleModal={toggleLargeImageModal}
        dismissModal={closeModals}
      />
      {/* Item content */}
      <StyledElems.SingleProductContainer id="#item-container" parentAspectRatio={parentAspectRatio}>
        <ProductAsidePanel id="#item-aside-panel">
          {/* WRAPS ALL THE CONTENT SCREENS (CAROUSEL || SHOWCASE || INFO) */}
          <StyledElems.SingleProductScreensContainer ref={setRef} bgColor={color} navLogo={navLogo} logo={logo}>
            {/* SCREEN 1 - CAROUSEL & LOGO */}
            <StyledElems.SingleProductScreen>
              {/* Breadcrumbs */}
              <Breadcrumbs {...breadcrumbs} marginTop="0.5rem" marginLeft="0.5rem" marginBottom={-25} color={bgColor} />
              {/* Product carousel */}
              <Carousel
                data={isMobile ? [...imageUrls /* , selectedVideo */] : imageUrls}
                startIndex={currentCarouselIndex}
                accentColor={color}
                videoProps={{ autoPlay }}
                fixedSizes={undefined}
              />
              {/* DYNAMIC LOGO */}
              <Logo
                parentNode={innerContainerRef}
                isCollectionView={false}
                logos={{ header: headerLogo, nav: navLogo, main: logo }}
              />
              <ProductPriceAndLabel variant={variant} color={color} title={title} shortDescription={shortDescription} />
            </StyledElems.SingleProductScreen>

            {/* SCREEN 2 - SHOWCASE */}
            <StyledElems.SingleProductScreen padding="0 0 3rem">
              {/* Size selector */}
              <ProductSubHeader
                useGradient
                bgColor={color}
                label="SIZE & SHOWCASE"
                margin={isMobile ? '1rem 0' : '0 0 2rem 0'}
              />
              <Column margin="0" padding={'0 2rem'}>
                {/* SHOWCASE MODEL SHOWCASE SETTINGS */}
                <ProductDescription fontWeight={300} padding="1rem 1.8rem" margin="0" style={{ zIndex: 1 }}>
                  <Row gap="1rem">
                    <FontAwesomeIcon icon={faLightbulb} /> SHOWCASE SETTINGS{' '}
                  </Row>
                </ProductDescription>
                <ShowcaseSettings>
                  <ShowcaseVideoControls isMobile={isMobile} />
                  {/* MOBILE SHOWCASE */}
                  <ModelSizeSelector />
                  {/* PRODUCT SIZE SELECTOR */}
                  <SizeSelector color={color} margin="0" />
                </ShowcaseSettings>
                {/* ADD TO CART */}
                <AddToCartButton
                  merchandiseId={variant?.variantBySelectedOptions?.id}
                  quantity={1}
                  buttonProps={{ bgImage: navLogo, backgroundColor: color || '#000' }}
                />
                {/* FREE SHIPPING LABEL */}
                {FREE_SHIPPING_THRESHOLD && (
                  <FreeShippingBanner fontWeight={300} flex="auto" minWidth={'21rem'} marginTop="2rem">
                    <Truck />
                    <Package /> FREE SHIPPING OVER {FREE_SHIPPING_THRESHOLD}€
                  </FreeShippingBanner>
                )}
              </Column>
            </StyledElems.SingleProductScreen>

            {/* SCREEN 3 - ITEM INFO */}
            <StyledElems.SingleProductScreen>
              {/* Item description */}
              <ProductSubHeader useGradient bgColor={color} label="INFO & CARE INSTRUCTIONS" />
              <Column padding="0 1.5rem">
                {/* From shopify backened console */}
                <ProductBackendDescription
                  dangerouslySetInnerHTML={{ __html: description }}
                  padding="0rem 4rem 1rem"
                  fontWeight={300}
                  accentColor={color}
                />
              </Column>
              {/* Credits */}
              <ProductSubHeader useGradient bgColor={color} label="CREDIT WHERE CREDIT IS DUE" margin="2rem 0" />
              <Column padding={'0 3rem'}>
                <ProductCredits>
                  {artistInfo ? (
                    <ProductArtistInfo {...artistInfo} bgColor={color} />
                  ) : (
                    <HighlightedText bgColor={color}>{PASTELLE_CREDIT}</HighlightedText>
                  )}
                </ProductCredits>
              </Column>
            </StyledElems.SingleProductScreen>
          </StyledElems.SingleProductScreensContainer>
        </ProductAsidePanel>

        <ShowcaseVideos
          videos={videos}
          videoProps={{
            autoPlay: true,
            style: {
              marginLeft: 'auto'
            }
          }}
          // // starts autoplaying and stops on "stopTime" seconds
          // autoPlayOptions={{
          //   stopTime: 4
          // }}
          hideVideo={isMobile || noVideo}
          showPoster={false}
          height={'100%'}
          zIndex={Z_INDEXES.BEHIND}
          firstPaintOver
          currentCarouselIndex={currentCarouselIndex}
          isMobileWidth={false}
        />
      </StyledElems.SingleProductContainer>
    </>
  )
}

/* function _getScreenContentOffsetHeight(screenNode: HTMLElement, ratio: [number, number]) {
  const logoHeight = (screenNode.clientWidth * ratio[1]) / ratio[0]
  const headerAndPriceLabelHeights = LAYOUT_REM_HEIGHT_MAP.HEADER + LAYOUT_REM_HEIGHT_MAP.PRICE_LABEL * BASE_FONT_SIZE

  const offsetHeight = screenNode.clientHeight - (logoHeight + headerAndPriceLabelHeights)
  return offsetHeight < 0 ? undefined : offsetHeight
}
 */
