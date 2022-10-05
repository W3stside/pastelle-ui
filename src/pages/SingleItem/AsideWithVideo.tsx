import { useEffect, useMemo, useState } from 'react'
import { BoxProps } from 'rebass'

import { Row } from 'components/Layout'
import Carousel from 'components/Carousel'
import { ItemVideoContent, SmallScreenVideoContent } from 'pages/SingleItem/ItemVideoContent'
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
  SubItemDescription,
  ItemLogoCssImport
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
import { OFF_WHITE } from 'theme/utils'
import { FREE_SHIPPING_THRESHOLD, STORE_IMAGE_SIZES, Z_INDEXES } from 'constants/config'

import ShippingSvg from 'assets/svg/shipping.svg'
import { isMobile } from 'utils'
import { getMobileShowcaseVideo916Height } from './utils'
import useModelSizeSelector from 'components/ModelSizeSelector'
import useShowShowcase from 'components/ShowcaseSettings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'

export interface ProductPageProps {
  bgColor: string
  color: string
  title: string
  handle: string
  logo?: string
  headerLogo?: string
  navLogo?: string
  images: FragmentProductImageFragment[]
  videos: FragmentProductVideoFragment[]
  // media: (FragmentProductExternalVideoFragment | FragmentProductVideoFragment)[]
  sizes: ProductOptionsSize
  description: string
  artistInfo?: ProductArtistInfo
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
  breadcrumbs,
  lastCrumb,
  ...rowProps
}: {
  breadcrumbs: string[]
  lastCrumb: string | undefined
} & BoxProps) {
  return (
    <Row {...rowProps} style={{ position: 'absolute', top: 0, left: 0, margin: 5, zIndex: 100 }}>
      {breadcrumbs?.map((crumb, index) => {
        const isLastCrumb = crumb === lastCrumb
        return (
          <ItemBreadcrumb key={crumb + '_' + index} to="/#">
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
    handleMobileItemClick?: React.MouseEventHandler<HTMLHeadingElement>
    showBreadCrumbs: boolean
  }
export default function ItemPage({
  bgColor,
  color = '#000',
  id,
  handle,
  title,
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
  loadInView,
  collectionView = false,
  noVideo = false,
  noDescription = false,
  showBreadCrumbs,
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

  /**
   * SIDE EFFECTS
   */
  // 1. Update in state the currently being viewed product
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
        mediaStartIndex={currentCarouselIndex}
        onCarouselChange={onCarouselChange}
      />
      {/* Item content */}
      <ItemContainer id="#item-container" style={style} collectionView={collectionView} bgColor={bgColor}>
        <ItemAsidePanel id="#item-aside-panel">
          <DynamicInnerContainer ref={setRef}>
            {/* Breadcrumbs */}
            {showBreadCrumbs && (
              <Breadcrumbs {...breadcrumbs} marginTop="0.5rem" marginLeft="0.5rem" marginBottom={-25} />
            )}
            {/* Item carousel */}
            <Carousel
              showCarouselContentIndicators={!collectionView}
              buttonColor={color}
              imageList={imageUrls}
              mediaStartIndex={currentCarouselIndex}
              onCarouselChange={onCarouselChange}
              onImageClick={toggleModal}
              loadInViewOptions={loadInView}
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
                      path={{ ikPath: logo }}
                      transformation={[{ width: innerContainerRef?.clientWidth, quality: 90, pr: true }]}
                      lazy={false}
                      lq
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
                    label="CHOOSE SIZE + SHOWCASE"
                    margin={isMobileWidth ? '0' : '0 0 2rem 0'}
                  />
                  <ItemContentContainer margin="0" padding={'0 2rem'}>
                    {isMobileWidth && (
                      <SmallScreenVideoContent
                        isOpen
                        firstPaintOver={firstPaintOver}
                        videos={videos}
                        currentCarouselIndex={currentCarouselIndex}
                        zIndex={Z_INDEXES.PRODUCT_VIDEOS}
                        height={getMobileShowcaseVideo916Height(innerContainerRef)}
                        margin="-2rem 0 2rem"
                        title="Tap to play/pause"
                        videoProps={{
                          // TODO: check ios autoplay
                          autoPlay: false,
                          style: {
                            cursor: 'pointer'
                          }
                        }}
                        isMobileWidth
                      />
                    )}
                    {/* SHOWCASE MODEL SHOWCASE SETTINGS */}
                    <SubItemDescription fontWeight={300} padding="1rem 1.8rem" margin="0" style={{ zIndex: 1 }}>
                      <Row style={{ gap: '1rem' }}>
                        <FontAwesomeIcon icon={faLightbulb} size={'sm'} /> SHOWCASE SETTINGS{' '}
                      </Row>
                    </SubItemDescription>
                    <ShowcaseSettings>
                      {/* MOBILE SHOWCASE */}
                      <ModelSizeSelector />
                    </ShowcaseSettings>
                    {/* PRODUCT SIZE SELECTOR */}
                    <SizeSelector color={bgColor} margin="2rem 0" />
                    {/* ADD TO CART AND QUANTITY */}
                    <AddToCartButtonAndQuantitySelector merchandiseId={merchandiseId} />
                    {FREE_SHIPPING_THRESHOLD && (
                      <SubItemDescription margin={'2rem 0 0 0'} fontWeight={300}>
                        <img src={ShippingSvg} /> FREE SHIPPING OVER {FREE_SHIPPING_THRESHOLD}€
                      </SubItemDescription>
                    )}
                  </ItemContentContainer>

                  {/* Item description */}
                  <ItemSubHeader useGradient bgColor={color} label="INFO + CARE INSTRUCTIONS" />
                  <ItemContentContainer padding="0 1.5rem">
                    <ItemDescription
                      dangerouslySetInnerHTML={{ __html: description }}
                      padding="0rem 4rem 1rem"
                      fontWeight={300}
                      backgroundColor={OFF_WHITE}
                    />
                  </ItemContentContainer>
                  {/* Credits */}
                  <ItemSubHeader useGradient bgColor={color} label="CREDIT WHERE CREDIT IS DUE" margin="2rem 0" />
                  <ItemContentContainer padding={'0 3rem'}>
                    <ItemCredits>
                      {artistInfo ? (
                        <ItemArtistInfo {...artistInfo} bgColor={color} />
                      ) : (
                        <HighlightedText bgColor={color}>{PASTELLE_CREDIT}</HighlightedText>
                      )}
                    </ItemCredits>
                  </ItemContentContainer>
                </ItemContentContainer>
              </>
            )}
          </DynamicInnerContainer>
        </ItemAsidePanel>
        {isMobileWidth || noVideo || collectionView ? null : (
          <ItemVideoContent
            videos={videos}
            videoProps={{
              autoPlay: true,
              style: {
                marginLeft: 'auto'
                // filter: 'contrast(1) saturate(2.3)'
              }
            }}
            showPoster={false}
            height="calc(100vh - 10rem)"
            zIndex={Z_INDEXES.BEHIND}
            firstPaintOver={firstPaintOver}
            currentCarouselIndex={currentCarouselIndex}
            isMobileWidth={false}
          />
        )}
      </ItemContainer>
    </>
  )
}
