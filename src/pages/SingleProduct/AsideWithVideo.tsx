import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Column, Row } from '@past3lle/components'
import { SkillLockStatus, useDeriveSkillState, useW3UserConnectionInfo } from '@past3lle/forge-web3'
import { useDetectScrollIntoView, useIsMobile, useStateRef } from '@past3lle/hooks'
import { setBestTextColour } from '@past3lle/theme'
import { getIsMobile as getIsMobileDevice } from '@past3lle/utils'
import AddToCartButton from 'components/AddToCartButton'
import { useBreadcrumb } from 'components/Breadcrumb'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { LargeImageCarousel } from 'components/Carousel/LargeProductImageCarousel'
import * as Carousels from 'components/Carousel/ProductCarousels'
import { ProductSwipeCarousel } from 'components/Carousel/ProductCarousels'
import { TinyHelperTextStyled } from 'components/Common'
import useModelSizeSelector from 'components/ModelSizeSelector'
import useShowShowcase from 'components/Showcase/Settings'
import ShowcaseVideos from 'components/Showcase/Videos'
import ShowcaseVideoControls from 'components/Showcase/Videos/Settings'
import useSizeSelector from 'components/SizeSelector'
import { SHOWCASE_ENABLED, Z_INDEXES } from 'constants/config'
import { LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import * as StyledElems from 'pages/SingleProduct/styled'
import Logo from 'pages/common/components/Logo'
import ProductPriceAndLabel from 'pages/common/components/ProductPriceAndLabel'
import ProductRarityAndLabel from 'pages/common/components/ProductRarityAndLabel'
import { DEFAULT_MEDIA_START_INDEX } from 'pages/common/constants'
import {
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
import { darken, transparentize } from 'polished'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'
import { getImageSizeMap } from 'shopify/utils'
import { useAppSelector } from 'state'
import { useGetSelectedProductShowcaseVideo } from 'state/collection/hooks'
import { useLargeImageModal, useSizeChartModal } from 'state/modalsAndPopups/hooks'
import { useThemeManager } from 'state/user/hooks'
import { ThemeModes } from 'theme'

export default function SingleProductPage({
  id,
  title,
  logo,
  color = '#000',
  bgColor,
  altColor,
  navLogo,
  headerLogo,
  // media,
  artistInfo,
  sizes = [],
  images = [],
  lockedImages = [],
  sizeChart = [],
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
  const { address } = useW3UserConnectionInfo()

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

  const { autoplay: autoPlay } = useAppSelector((state) => state.user.showcase.videoSettings)

  const isMobile = useIsMobile()

  // MOBILE/WEB CAROUSEL
  const { currentIndex: currentCarouselIndex, onChange: onCarouselChange } = useProductWebCarouselActions({
    startIndex: DEFAULT_MEDIA_START_INDEX,
  })
  const Carousel = useCallback(
    (props: Omit<ProductSwipeCarousel, 'touchAction'>) =>
      getIsMobileDevice() ? (
        <Carousels.SwipeCarousel {...props} touchAction="pan-y" />
      ) : (
        <Carousels.ClickCarousel
          {...props}
          showButtons
          onCarouselItemClick={toggleLargeImageModal}
          onCarouselChange={onCarouselChange}
        />
      ),
    // Ignore onCarouselChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggleLargeImageModal]
  )

  /// BREADCRUMBS
  const breadcrumbs = useBreadcrumb()

  // PRODUCT/SIZE CHART IMAGES
  const [imageUrls, sizeChartImageUrls] = useMemo(
    () => [getImageSizeMap(skillState === SkillLockStatus.LOCKED ? lockedImages : images), getImageSizeMap(sizeChart)],
    [images, lockedImages, sizeChart, skillState]
  )

  // SELECTED SHOWCASE VIDEO
  const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })

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

  const { mode, content } = useThemeManager()

  return (
    <>
      {/* Large product images */}
      <LargeImageCarousel
        images={[imageUrls[currentCarouselIndex]]}
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
                data={isMobile ? [...imageUrls, selectedVideo] : imageUrls}
                startIndex={currentCarouselIndex}
                colors={{ accent: color }}
                videoProps={{ autoPlay }}
              />
              {/* DYNAMIC LOGO */}
              <Logo
                logoCss={`
                  filter: ${
                    mode === ThemeModes.DARK
                      ? `invert(1) saturate(1.4) hue-rotate(180deg) drop-shadow(0px 3px 7px ${bgColor})`
                      : `drop-shadow(0px 5px 5px ${bgColor})`
                  };
                `}
                parentNode={screensContainer}
                isCollectionView={false}
                logos={{ header: headerLogo, nav: navLogo, main: logo }}
              />
              <ProductPriceAndLabel variant={variant} color={color} title={title} shortDescription={shortDescription} />
              {process.env.REACT_APP_USE_FORGE == 'true' && (
                <ProductRarityAndLabel
                  lockStatus={skillState}
                  variant={variant}
                  title={`RARITY: ${skillMetadata?.properties.rarity.toUpperCase() || 'COMMON'}`}
                  shortDescription={
                    skillState === SkillLockStatus.LOCKED
                      ? !address
                        ? 'SKILL LOCKED - LOGIN TO VERIFY STATUS'
                        : 'SKILL LOCKED - VIEW PREREQUISITES IN THE FORGE'
                      : 'UNLOCKED! READ MORE IN THE FORGE SKILLBOOK'
                  }
                />
              )}
            </StyledElems.SingleProductScreen>

            {/* SCREEN 2 - SHOWCASE */}
            <StyledElems.SingleProductScreen padding="0">
              {/* Size selector */}
              <ProductSubHeader
                useGradient
                bgColor={color}
                label="SIZE & CONFIGURATION"
                margin={isMobile ? '1rem 0' : '0'}
              />
              <Column margin="0" padding={'0 2rem'}>
                {/* SHOWCASE MODEL SHOWCASE SETTINGS */}
                {skillState !== SkillLockStatus.LOCKED && (
                  <>
                    {SHOWCASE_ENABLED && (
                      <ProductDescription
                        fontWeight={300}
                        padding="1rem 1.8rem"
                        margin="1rem 0 0"
                        style={{ zIndex: 1 }}
                      >
                        <Row gap="1rem">
                          <FontAwesomeIcon icon={faLightbulb} /> SHOWCASE SETTINGS
                        </Row>
                      </ProductDescription>
                    )}

                    <ShowcaseSettings>
                      <ShowcaseVideoControls isMobile={false} margin="1rem auto 0" width="100%" />
                      {/* MOBILE SHOWCASE */}
                      {SHOWCASE_ENABLED && <ModelSizeSelector />}
                      {/* PRODUCT SIZE SELECTOR */}
                      <SizeSelector color={bgColor} margin="0" />

                      <TinyHelperTextStyled margin={'0.5rem 0 0.5rem 1rem'} onClick={toggleSizeChartModal}>
                        SIZE CHART
                      </TinyHelperTextStyled>
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
                <Column
                  overflow="hidden"
                  borderRadius="1rem"
                  backgroundColor={
                    mode === ThemeModes.DARK ? content.background : transparentize(0.1, altColor || darken(0.02, color))
                  }
                >
                  <Logo
                    id="product-logo__description"
                    logoCss={`
                      filter: ${
                        mode === ThemeModes.DARK ? 'invert(1) hue-rotate(180deg)' : ''
                      } brightness(0.75) drop-shadow(0px -5px 5px ${mode === ThemeModes.DARK ? color : bgColor});
                      transform: rotate(180deg);
                      margin: 0 0 -12.5% 0;
                    `}
                    logoBgAttributes={['bottom/contain no-repeat', 'bottom/contain no-repeat']}
                    parentNode={screensContainer}
                    isCollectionView={false}
                    logos={{ header: headerLogo, nav: navLogo, main: logo }}
                  />
                  {/* From shopify backened console */}
                  {skillState !== SkillLockStatus.LOCKED ? (
                    <ProductBackendDescription
                      dangerouslySetInnerHTML={{ __html: description }}
                      padding="0rem 4rem 2rem"
                      fontWeight={300}
                      accentColor={bgColor}
                      backgroundColor="transparent"
                      color={mode === ThemeModes.DARK ? content.text : setBestTextColour(color)}
                      css={`
                        h1:first-of-type {
                          text-decoration: none;
                          font-size: 4rem;
                          > strong {
                            color: ${setBestTextColour(bgColor)};
                            background-color: ${bgColor};
                            font-weight: 100;
                            font-variation-settings: 'wght' 50;
                            padding: 0.25rem 1rem 0.25rem 0.55rem;
                          }
                        }
                      `}
                    />
                  ) : (
                    <RedactedInformationDescription />
                  )}
                </Column>
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
          forceLoad={isMobile}
          smartFill={!isMobile}
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

function useProductWebCarouselActions({ startIndex }: { startIndex: number }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const onChange = (index: number) => setCurrentIndex(index)

  const location = useLocation()

  // EFFECT: on product change, reset web carousel index to 0
  useEffect(() => {
    setCurrentIndex(startIndex)
    // Ignore startIndex as dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  return {
    currentIndex,
    setCurrentIndex,
    onChange,
  }
}
