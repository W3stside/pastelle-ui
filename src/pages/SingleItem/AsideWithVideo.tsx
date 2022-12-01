import { useEffect, useMemo, useState } from 'react'
import { BoxProps } from 'rebass'

import { Column, Row } from 'components/Layout'
import AnimatedCarousel from 'components/Carousel/AnimatedCarousel'
import ButtonCarousel from 'components/Carousel/ButtonCarousel'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import SmartImg from 'components/SmartImg'
import LargeImageCarouselModal from 'components/LargeImageCarouselModal'
import AddToCartButtonAndQuantitySelector from 'components/AddToCartButtonAndQuantitySelector'
import {
  ItemContainer,
  ItemAsidePanel,
  ItemLogo,
  ItemDescription,
  ItemCredits,
  ItemArtistInfo,
  PASTELLE_CREDIT,
  ItemSubHeader,
  ItemBreadcrumb,
  MobileItemCTA,
  InnerContainer,
  HighlightedText,
  ItemLogoCollectionView,
  InnerCollectionContainer,
  ItemContentContainer,
  ItemLogoCssImport,
  FreeShippingBanner,
  ScrollingProductLabel
} from './styleds'

import { useBreadcrumb } from 'components/Breadcrumb'
import { useToggleModal, useModalOpen, useCloseModals } from 'state/modalsAndPopups/hooks'
import { useUpdateCurrentlyViewing } from 'state/collection/hooks'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'
import { useQueryProductVariantId } from 'shopify/graphql/hooks'
import useStateRef from 'hooks/useStateRef'
import useSizeSelector from 'components/SizeSelector'

import { ApplicationModal } from 'state/modalsAndPopups/reducer'

import {
  FragmentProductVideoFragment,
  FragmentProductImageFragment,
  ProductOptionsSize,
  ProductArtistInfo,
  Product
} from 'shopify/graphql/types'

import { getImageSizeMap } from 'shopify/utils'
import { FREE_SHIPPING_THRESHOLD, SINGLE_ITEM_LOGO_RATIO, STORE_IMAGE_SIZES, Z_INDEXES } from 'constants/config'

// import ShippingSvg from 'assets/svg/shipping.svg'
import { isMobile } from 'utils'
import { getMobileShowcaseVideo916Height } from './utils'
import useModelSizeSelector from 'components/ModelSizeSelector'
import useShowShowcase from 'components/Showcase/Settings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import ShowcaseVideos from 'components/Showcase/Videos'
import { Package, Truck } from 'react-feather'
import { GenericImageSrcSet } from 'shopify/graphql/types'

export interface ProductPageProps {
  bgColor: string
  color: string
  title: string
  handle: string
  logo?: GenericImageSrcSet
  headerLogo?: GenericImageSrcSet
  navLogo?: GenericImageSrcSet
  images: FragmentProductImageFragment[]
  videos: FragmentProductVideoFragment[]
  // media: (FragmentProductExternalVideoFragment | FragmentProductVideoFragment)[]
  sizes: ProductOptionsSize
  description: string
  artistInfo?: ProductArtistInfo
  shortDescription?: string
  id: string
  collectionView?: boolean
  noVideo?: boolean
  noDescription?: boolean
}

export type CollectionMap = Record<Product['handle'], ProductPageProps>

export type ItemPageDesignsProps = {
  headerLogo?: string
  navLogo?: string
}

function Breadcrumbs({
  color,
  breadcrumbs,
  lastCrumb,
  ...rowProps
}: {
  color: string
  breadcrumbs: string[]
  lastCrumb: string | undefined
} & BoxProps) {
  return (
    <Row {...rowProps} style={{ position: 'absolute', top: 0, left: 0, margin: 5, zIndex: 100 }}>
      {breadcrumbs?.map((crumb, index) => {
        const isLastCrumb = crumb === lastCrumb
        return (
          <ItemBreadcrumb key={crumb + '_' + index} color={color} to="/#">
            <span>{!isLastCrumb ? crumb : <strong>{crumb}</strong>}</span>
            {!isLastCrumb && <span>{'//'}</span>}
          </ItemBreadcrumb>
        )
      })}
    </Row>
  )
}

const DEFAULT_MEDIA_START_INDEX = 0
export type SingleItemPageProps = ProductPageProps &
  ScrollableContentComponentBaseProps & {
    style?: any
    showBreadCrumbs: boolean
    showProductLabel?: boolean
    handleMobileItemClick?: React.MouseEventHandler<HTMLHeadingElement>
  }
export default function ItemPage({
  bgColor,
  color = '#000',
  id,
  handle,
  title,
  shortDescription,
  logo,
  navLogo,
  headerLogo,
  images = [],
  videos = [],
  // media,
  sizes = [],
  description,
  artistInfo,
  // TODO: re-enable id
  // id,
  isActive,
  firstPaintOver,
  loadInViewOptions,
  collectionView = false,
  noVideo = false,
  noDescription = false,
  showBreadCrumbs,
  showProductLabel = false,
  style,
  handleMobileItemClick
}: SingleItemPageProps) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(DEFAULT_MEDIA_START_INDEX)
  const onCarouselChange = (index: number) => setCurrentCarouselIndex(index)

  // MODALS
  const toggleModal = useToggleModal(ApplicationModal.ITEM_LARGE_IMAGE)
  const closeModals = useCloseModals()
  const showLargeImage = useModalOpen(ApplicationModal.ITEM_LARGE_IMAGE)

  /// BREADCRUMBS
  const breadcrumbs = useBreadcrumb()

  // IMAGES
  const imageUrls = getImageSizeMap(images)

  const updateCurrentlyViewing = useUpdateCurrentlyViewing()
  useEffect(() => {
    if (isActive) {
      updateCurrentlyViewing({ handle, id })
    }
  }, [isActive, handle, id, updateCurrentlyViewing])

  // inner container ref
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, node => node)
  const DynamicInnerContainer = useMemo(() => (collectionView ? InnerCollectionContainer : InnerContainer), [
    collectionView
  ])

  // mobile vs web carousel
  const Carousel = useMemo(() => (isMobile && !collectionView ? AnimatedCarousel : ButtonCarousel), [collectionView])

  // collection display logo to use
  const collectionViewProductLogo = navLogo || headerLogo

  const { ShowcaseSettings } = useShowShowcase()
  const { SizeSelector, selectedSize } = useSizeSelector({ sizes })
  const { ModelSizeSelector } = useModelSizeSelector()
  const merchandiseId = useQueryProductVariantId({ productId: id, key: 'Size', value: selectedSize })

  const isMobileWidth = useIsMobileWindowWidthSize()

  return (
    <>
      {/* Large images */}
      <LargeImageCarouselModal
        isOpen={isActive && showLargeImage}
        toggleModal={toggleModal}
        dismissModal={closeModals}
        // Carousel props
        buttonColor={color}
        imageList={imageUrls}
        transformation={[
          {
            width: images[0]?.width || STORE_IMAGE_SIZES.LARGE,
            height: images[0]?.height || STORE_IMAGE_SIZES.LARGE /* , xc: 500, yc: 500 */
          }
        ]}
        startIndex={currentCarouselIndex}
        // onCarouselChange={onCarouselChange}
      />
      {/* Product label: used in scolling collection */}
      {showProductLabel && (
        <ScrollingProductLabel logo={headerLogo} labelColor={bgColor}>
          <strong>{title}</strong> <span style={{ fontSize: 'smaller' }}>{shortDescription}</span>
        </ScrollingProductLabel>
      )}
      {/* Item content */}
      <ItemContainer
        id="#item-container"
        style={style}
        collectionView={collectionView}
        bgColor={color}
        navLogo={navLogo}
        logo={logo}
      >
        <ItemAsidePanel id="#item-aside-panel">
          <DynamicInnerContainer ref={setRef}>
            {/* Breadcrumbs */}
            {showBreadCrumbs && (
              <Breadcrumbs {...breadcrumbs} marginTop="0.5rem" marginLeft="0.5rem" marginBottom={-25} color={bgColor} />
            )}
            {/* Item carousel */}
            <Carousel
              showCarouselContentIndicators={!collectionView}
              buttonColor={color}
              imageList={imageUrls}
              startIndex={currentCarouselIndex}
              onCarouselChange={onCarouselChange}
              onImageClick={toggleModal}
              loadInViewOptions={loadInViewOptions}
              collectionView={collectionView}
              fixedHeight={collectionView ? '100%' : undefined}
            />

            {/* Wrap everything else in a fragment */}
            {noDescription ? null : collectionView ? (
              <>
                {collectionViewProductLogo ? (
                  <ItemLogoCollectionView logoUri={collectionViewProductLogo} $bgColor="ghostwhite" />
                ) : (
                  <ItemLogo
                    $marginTop={
                      innerContainerRef?.clientWidth ? `calc(${innerContainerRef?.clientWidth}px / -7)` : undefined
                    }
                  >
                    {title}
                  </ItemLogo>
                )}
                <MobileItemCTA
                  alignItems="center"
                  justifyContent="center"
                  onClick={handleMobileItemClick && handleMobileItemClick}
                >
                  <strong style={{ marginLeft: 7 }}> VIEW MORE</strong>
                </MobileItemCTA>
              </>
            ) : (
              <>
                {!logo ? (
                  title
                ) : !isMobile ? (
                  <ItemLogo>
                    <SmartImg
                      path={{ defaultPath: logo.defaultUrl }}
                      pathSrcSet={logo}
                      lazy={false}
                      lqImageOptions={{
                        width: innerContainerRef?.clientWidth || 0,
                        get height() {
                          return (this.width * SINGLE_ITEM_LOGO_RATIO[0]) / SINGLE_ITEM_LOGO_RATIO[1]
                        },
                        showLoadingIndicator: false
                      }}
                    />
                  </ItemLogo>
                ) : (
                  innerContainerRef?.clientWidth && (
                    <ItemLogoCssImport
                      logoUri={logo}
                      height={innerContainerRef.clientWidth / 3.64}
                      position="relative"
                    />
                  )
                )}

                {/* ITEM CONTENT: description, credits, etc */}
                <ItemContentContainer padding="0 0 3rem">
                  {/* Size selector */}
                  <ItemSubHeader
                    useGradient
                    bgColor={color}
                    label="SIZE & SHOWCASE"
                    margin={isMobileWidth ? '0' : '0 0 2rem 0'}
                  />
                  <Column margin="0" padding={'0 2rem'}>
                    <ShowcaseVideos
                      videos={videos}
                      videoProps={{
                        // TODO: check ios autoplay
                        // autoPlay: false,
                        style: {
                          cursor: 'pointer'
                        }
                      }}
                      currentCarouselIndex={currentCarouselIndex}
                      hideVideo={!isMobileWidth}
                      firstPaintOver={firstPaintOver}
                      zIndex={Z_INDEXES.PRODUCT_VIDEOS}
                      height={getMobileShowcaseVideo916Height(innerContainerRef)}
                      margin="0 0 2rem"
                      title="Tap to play/pause"
                      isMobileWidth
                    />
                    {/* SHOWCASE MODEL SHOWCASE SETTINGS */}
                    <ItemDescription fontWeight={300} padding="1rem 1.8rem" margin="0" style={{ zIndex: 1 }}>
                      <Row style={{ gap: '1rem' }}>
                        <FontAwesomeIcon icon={faLightbulb} /> SHOWCASE SETTINGS{' '}
                      </Row>
                    </ItemDescription>
                    <ShowcaseSettings>
                      {/* MOBILE SHOWCASE */}
                      <ModelSizeSelector />
                      {/* PRODUCT SIZE SELECTOR */}
                      <SizeSelector color={color} margin="0" />
                    </ShowcaseSettings>
                    {/* ADD TO CART AND QUANTITY */}
                    <AddToCartButtonAndQuantitySelector merchandiseId={merchandiseId} />
                    {FREE_SHIPPING_THRESHOLD && (
                      <FreeShippingBanner margin={'2rem 0 0 0'} fontWeight={300}>
                        <Truck />
                        <Package /> FREE SHIPPING OVER {FREE_SHIPPING_THRESHOLD}€
                      </FreeShippingBanner>
                    )}
                  </Column>

                  {/* Item description */}
                  <ItemSubHeader useGradient bgColor={color} label="INFO & CARE INSTRUCTIONS" />
                  <Column padding="0 1.5rem">
                    <ItemDescription
                      dangerouslySetInnerHTML={{ __html: description }}
                      padding="0rem 4rem 1rem"
                      fontWeight={300}
                      css={`
                        blockquote {
                          margin: 0;
                        }

                        h1,
                        h2,
                        h3,
                        h4 {
                          text-decoration: underline 0.3rem solid ${color};
                          &:not(h1) {
                            margin-bottom: 1rem;
                          }
                        }
                        ul,
                        ol {
                          list-style: tibetan;
                          margin-top: 0;
                        }
                      `}
                    />
                  </Column>
                  {/* Credits */}
                  <ItemSubHeader useGradient bgColor={color} label="CREDIT WHERE CREDIT IS DUE" margin="2rem 0" />
                  <Column padding={'0 3rem'}>
                    <ItemCredits>
                      {artistInfo ? (
                        <ItemArtistInfo {...artistInfo} bgColor={color} />
                      ) : (
                        <HighlightedText bgColor={color}>{PASTELLE_CREDIT}</HighlightedText>
                      )}
                    </ItemCredits>
                  </Column>
                </ItemContentContainer>
              </>
            )}
          </DynamicInnerContainer>
        </ItemAsidePanel>
        <ShowcaseVideos
          videos={videos}
          videoProps={{
            autoPlay: true,
            style: {
              marginLeft: 'auto'
              // filter: 'contrast(1) saturate(2.3)'
            }
          }}
          hideVideo={isMobileWidth || noVideo || collectionView}
          showPoster={false}
          height="calc(100vh - 10rem)"
          zIndex={Z_INDEXES.BEHIND}
          firstPaintOver={firstPaintOver}
          currentCarouselIndex={currentCarouselIndex}
          isMobileWidth={false}
        />
      </ItemContainer>
    </>
  )
}
