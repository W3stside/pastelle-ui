import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Column, Row } from '@past3lle/components'
import { SkillLockStatus, useDeriveSkillState, useW3Connection } from '@past3lle/forge-web3'
import { useDetectScrollIntoView, useIsMobile, useStateRef } from '@past3lle/hooks'
import { isMobile as isMobileDevice } from '@past3lle/utils'
import AddToCartButton from 'components/AddToCartButton'
import { useBreadcrumb } from 'components/Breadcrumb'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { LargeImageCarousel } from 'components/Carousel/LargeProductImageCarousel'
import * as Carousels from 'components/Carousel/ProductCarousels'
import { ProductSwipeCarousel } from 'components/Carousel/ProductCarousels'
import useModelSizeSelector from 'components/ModelSizeSelector'
import useShowShowcase from 'components/Showcase/Settings'
import ShowcaseVideos from 'components/Showcase/Videos'
import ShowcaseVideoControls from 'components/Showcase/Videos/Settings'
import useSizeSelector from 'components/SizeSelector'
import { FREE_SHIPPING_THRESHOLD, Z_INDEXES } from 'constants/config'
import { LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import * as StyledElems from 'pages/SingleProduct/styled'
import Logo from 'pages/common/components/Logo'
import ProductPriceAndLabel from 'pages/common/components/ProductPriceAndLabel'
import ProductRarityAndLabel from 'pages/common/components/ProductRarityAndLabel'
import { DEFAULT_MEDIA_START_INDEX } from 'pages/common/constants'
import {
  FreeShippingBanner,
  HighlightedText,
  PASTELLE_CREDIT,
  ProductArtistInfo,
  ProductBackendDescription,
  ProductCredits,
  ProductDescription,
  ProductSubHeader,
  ScrollingProductLabel,
} from 'pages/common/styleds'
import { SingleProductPageProps, WithParentAspectRatio } from 'pages/common/types'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Package, Truck } from 'react-feather'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'
import { getImageSizeMap } from 'shopify/utils'
import { useAppSelector } from 'state'
import { useCloseModals, useModalOpen, useToggleModal } from 'state/modalsAndPopups/hooks'
import { ApplicationModal } from 'state/modalsAndPopups/reducer'

// import { useGetSelectedProductShowcaseVideo } from 'state/collection/hooks'

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
  lockedImages = [],
  videos = [],
  description,
  noVideo = false,
  shortDescription,
  skillMetadata,
  parentAspectRatio,
}: SingleProductPageProps & WithParentAspectRatio) {
  // SKILL STATE FROM METADATA
  const skillState = useDeriveSkillState(skillMetadata)

  // USER BLOCKCHAIN INFO
  const [, , { address }] = useW3Connection()

  // MODALS
  const toggleLargeImageModal = useToggleModal(ApplicationModal.ITEM_LARGE_IMAGE)
  const closeModals = useCloseModals()
  const showLargeImage = useModalOpen(ApplicationModal.ITEM_LARGE_IMAGE)

  const { autoplay: autoPlay } = useAppSelector((state) => state.user.showcase.videoSettings)

  const isMobile = useIsMobile()

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
  const imageUrls = useMemo(
    () => getImageSizeMap(skillState === SkillLockStatus.LOCKED ? lockedImages : images),
    [images, lockedImages, skillState]
  )

  // SELECTED SHOWCASE VIDEO
  // const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })

  // CONTENT CONTAINER REF FOR DYNAMIC SIZE UPDATING AND CAROUSELS
  const asideContainerRef = useRef<HTMLElement>()
  const { current: asideContainer } = asideContainerRef
  const [screensContainer, setScreensContainerRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)

  const { ShowcaseSettings } = useShowShowcase()
  const { SizeSelector, selectedSize } = useSizeSelector({ sizes })
  const { ModelSizeSelector } = useModelSizeSelector()
  const variant = useQueryProductVariantByKeyValue({ productId: id, key: 'Size', value: selectedSize })

  const addToCartButtonRef = useRef<HTMLButtonElement | null>(null)
  const addToCartButtonInView = useDetectScrollIntoView(
    addToCartButtonRef.current,
    { root: asideContainer, continuous: true },
    !!asideContainer
  )
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
        <StyledElems.SingleProductAsidePanel id="#item-aside-panel" ref={asideContainerRef}>
          {/* WRAPS ALL THE CONTENT SCREENS (CAROUSEL || SHOWCASE || INFO) */}
          <StyledElems.SingleProductScreensContainer
            ref={setScreensContainerRef}
            bgColor={color}
            navLogo={navLogo}
            logo={logo}
            $calculatedSizes={{ height: asideContainer?.clientHeight, width: screensContainer?.clientWidth }}
          >
            {/* SCREEN 1 - CAROUSEL & LOGO */}
            <StyledElems.SingleProductScreen>
              {/* Breadcrumbs */}
              <ScrollingProductLabel logo={headerLogo} padding={'0.25rem'}>
                <Breadcrumbs {...breadcrumbs} color={bgColor} />
              </ScrollingProductLabel>
              {/* Product carousel */}
              <Carousel
                axis="x"
                data={isMobile ? [...imageUrls /* , selectedVideo */] : imageUrls}
                startIndex={currentCarouselIndex}
                colors={{ accent: color }}
                videoProps={{ autoPlay }}
              />
              {/* DYNAMIC LOGO */}
              <Logo
                parentNode={screensContainer}
                isCollectionView={false}
                logos={{ header: headerLogo, nav: navLogo, main: logo }}
              />
              <ProductPriceAndLabel variant={variant} color={color} title={title} shortDescription={shortDescription} />
              <ProductRarityAndLabel
                lockStatus={skillState}
                variant={variant}
                title={`RARITY: ${skillMetadata?.properties.rarity.toUpperCase() || 'COMMON'}`}
                shortDescription={
                  skillState === SkillLockStatus.LOCKED
                    ? 'ITEM LOCKED'
                    : address
                    ? 'SKILL INFO AVAILABLE IN THE FORGE'
                    : 'LOGIN TO VIEW SKILL INFO IN THE FORGE'
                }
              />
            </StyledElems.SingleProductScreen>

            {/* SCREEN 2 - SHOWCASE */}
            <StyledElems.SingleProductScreen padding="0 0 3rem">
              {/* Size selector */}
              <ProductSubHeader
                useGradient
                bgColor={color}
                label={skillState !== SkillLockStatus.LOCKED ? 'SIZE & SHOWCASE' : undefined}
                margin={isMobile ? '1rem 0' : '0 0 2rem 0'}
              />
              <Column margin="0" padding={'0 2rem'}>
                {/* SHOWCASE MODEL SHOWCASE SETTINGS */}
                {skillState !== SkillLockStatus.LOCKED && (
                  <>
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
                  </>
                )}

                <AddToCartButton
                  ref={addToCartButtonRef}
                  product={variant}
                  skillLocked={skillState === SkillLockStatus.LOCKED}
                  quantity={1}
                  buttonProps={{ bgImage: navLogo, backgroundColor: color || '#000', width: '100%' }}
                />

                {/* FIXED ADD TO CART BUTTON */}
                <StyledElems.AddToCartButtonWrapper
                  isInView={addToCartButtonInView}
                  width={screensContainer?.clientWidth + 'px'}
                >
                  <AddToCartButton
                    product={variant}
                    skillLocked={skillState === SkillLockStatus.LOCKED}
                    quantity={1}
                    buttonProps={{ bgImage: navLogo, backgroundColor: color || '#000' }}
                  />
                </StyledElems.AddToCartButtonWrapper>

                {/* FREE SHIPPING LABEL */}
                {FREE_SHIPPING_THRESHOLD && skillState !== SkillLockStatus.LOCKED && (
                  <FreeShippingBanner fontWeight={300} flex="auto" minWidth={'21rem'} marginTop="2rem">
                    <Truck />
                    <Package /> FREE SHIPPING OVER {FREE_SHIPPING_THRESHOLD}€
                  </FreeShippingBanner>
                )}
              </Column>
            </StyledElems.SingleProductScreen>

            {/* SCREEN 3 - ITEM INFO */}
            <StyledElems.SingleProductScreen paddingBottom={LAYOUT_REM_HEIGHT_MAP.FIXED_ADD_TO_CART_BUTTON + 'rem'}>
              {/* Item description */}
              <ProductSubHeader
                useGradient
                bgColor={color}
                label={
                  skillState !== SkillLockStatus.LOCKED
                    ? 'INFO & CARE INSTRUCTIONS'
                    : 'DESCRIPTION: INFORMATION REDACTED'
                }
              />
              <Column padding="0 1.5rem">
                {/* From shopify backened console */}
                {skillState !== SkillLockStatus.LOCKED ? (
                  <ProductBackendDescription
                    dangerouslySetInnerHTML={{ __html: description }}
                    padding="0rem 4rem 1rem"
                    fontWeight={300}
                    accentColor={color}
                  />
                ) : (
                  <RedactedInformationDescription />
                )}
              </Column>
              {/* Credits */}
              <ProductSubHeader
                useGradient
                bgColor={color}
                label={skillState !== SkillLockStatus.LOCKED ? 'CREDIT WHERE CREDIT IS DUE' : undefined}
                margin="2rem 0"
              />
              {skillState !== SkillLockStatus.LOCKED && (
                <Column padding={'0 3rem'}>
                  <ProductCredits>
                    {artistInfo ? (
                      <ProductArtistInfo {...artistInfo} bgColor={color} />
                    ) : (
                      <HighlightedText bgColor={color}>{PASTELLE_CREDIT}</HighlightedText>
                    )}
                  </ProductCredits>
                </Column>
              )}
            </StyledElems.SingleProductScreen>
          </StyledElems.SingleProductScreensContainer>
        </StyledElems.SingleProductAsidePanel>

        <ShowcaseVideos
          videos={videos}
          videoProps={{
            autoPlay: true,
            style: {
              marginLeft: 'auto',
            },
          }}
          hideVideo={isMobile || noVideo}
          showPoster
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

// component that renders "redacted" information for locked skills
const RedactedInformationDescription = (): JSX.Element => {
  return (
    <Column padding="0 1.5rem">
      <ProductDescription
        fontWeight={300}
        padding="0rem 4rem 1rem"
        color={'transparent'}
        css={`
          > * {
            background-color: indianred;
          }
        `}
      >
        <h1>REDACTED PRODUCT</h1>
        <p>This information is redacted until the skill is unlocked.</p>
        <p>Haha, nice try trying to change the font colour. We knew you&apos;d try.</p>
        <p>But there&apos;s no way to see the redacted product information until you unlock the skill!</p>
      </ProductDescription>
    </Column>
  )
}
