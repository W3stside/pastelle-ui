import { useEffect, useMemo, useState } from 'react'
import { BoxProps } from 'rebass'

import { Row } from 'components/Layout'
import Carousel from 'components/Carousel'
import { ItemVideoContent, SmallScreenVideoContent } from 'pages/SingleItem/ItemVideoContent'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import SmartImg from 'components/SmartImg'
import LargeImageCarouselModal from 'components/LargeImageCarouselModal'
import AddToCartButtonAndQuantitySelector from 'components/AddToCartButtonAndQuantitySelector'
import { TinyHelperText } from 'components/Common'
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
  ItemLogoCatalogView,
  InnerCatalogContainer,
  ItemContentContainer,
  SubItemDescription
} from './styleds'

import { useBreadcrumb } from 'components/Breadcrumb'
import { useToggleModal, useModalOpen, useCloseModals } from 'state/modalsAndPopups/hooks'
import { useUpdateCurrentlyViewing } from 'state/collection/hooks'
import { useGetWindowSize } from 'state/window/hooks'
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
import { BLACK, OFF_WHITE } from 'theme/utils'
import { MEDIA_WIDTHS } from 'theme/styles/mediaQueries'
import { STORE_IMAGE_SIZES, Z_INDEXES } from 'constants/config'

import ShippingSvg from 'assets/svg/shipping.svg'

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
  catalogView?: boolean
  noVideo?: boolean
  noDescription?: boolean
}

export type CatalogMap = Record<Product['handle'], ProductPageProps>

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
  catalogView = false,
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
  // 1. scrolling page current index set in state as on screen
  const updateCurrentlyViewing = useUpdateCurrentlyViewing()
  useEffect(() => {
    if (isActive) {
      updateCurrentlyViewing({ handle, id })
    }
  }, [isActive, handle, id, updateCurrentlyViewing])

  // inner container ref
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, node => node)

  const DynamicInnerContainer = useMemo(() => (catalogView ? InnerCatalogContainer : InnerContainer), [catalogView])

  // catalog display logo to use
  const catalogLogo = navLogo || headerLogo

  const { SizeSelector, selectedSize } = useSizeSelector({ sizes })
  const merchandiseId = useQueryProductVariantId({ productId: id, key: 'Size', value: selectedSize })

  const [showShowcase, setShowShowcase] = useState(false)
  const toggleMobileShowcase = () => setShowShowcase(state => !state)

  const windowSizes = useGetWindowSize()
  // undefined (loading) defaults to mobile
  const isMobileShowcase = !!windowSizes?.width && windowSizes.width <= MEDIA_WIDTHS.upToSmall

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
      <ItemContainer id="#item-container" style={style} catalogView={catalogView} bgColor={bgColor}>
        <ItemAsidePanel id="#item-aside-panel">
          <DynamicInnerContainer ref={setRef}>
            {/* Breadcrumbs */}
            {showBreadCrumbs && (
              <Breadcrumbs {...breadcrumbs} marginTop={'5px'} marginLeft={'5px'} marginBottom={-25} />
            )}
            {/* Item carousel */}
            <Carousel
              showCarouselContentIndicators={!catalogView}
              buttonColor={color}
              imageList={imageUrls}
              mediaStartIndex={currentCarouselIndex}
              onCarouselChange={onCarouselChange}
              onImageClick={toggleModal}
              loadInViewOptions={loadInView}
              catalogView={catalogView}
              fixedHeight={catalogView ? '100%' : undefined}
            />

            {/* Wrap everything else in a fragment */}
            {noDescription ? null : catalogView ? (
              <>
                {catalogLogo ? (
                  <ItemLogoCatalogView logoUri={catalogLogo} $bgColor="ghostwhite" />
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
                <ItemLogo>
                  {logo ? (
                    <SmartImg
                      ikPath={logo}
                      transformation={[{ width: innerContainerRef?.clientWidth, quality: 100, pr: true }]}
                      loading="lazy"
                      lq
                    />
                  ) : (
                    title
                  )}
                </ItemLogo>

                {/* ITEM CONTENT: description, credits, etc */}
                <ItemContentContainer padding="0 0 3rem">
                  {/* Credits */}
                  <ItemSubHeader useGradient bgColor={color} label="CREDIT" margin="0 0 2rem" />
                  <ItemContentContainer padding={'0 3rem'}>
                    <ItemCredits>
                      {artistInfo ? (
                        <ItemArtistInfo {...artistInfo} bgColor={color} />
                      ) : (
                        <HighlightedText bgColor={color}>{PASTELLE_CREDIT}</HighlightedText>
                      )}
                    </ItemCredits>
                  </ItemContentContainer>

                  {/* Size selector */}
                  <ItemSubHeader useGradient bgColor={color} label="CHOOSE SIZE + VIEW LIVE" />
                  <ItemContentContainer margin="0" padding={'0 2rem'}>
                    {isMobileShowcase && (
                      <SmallScreenVideoContent
                        isOpen
                        firstPaintOver={firstPaintOver}
                        videos={videos}
                        currentCarouselIndex={currentCarouselIndex}
                        zIndex={Z_INDEXES.PRODUCT_VIDEOS}
                        height="auto"
                        width="120%"
                        margin="-2rem 0 2rem"
                      />
                    )}
                    <SubItemDescription fontWeight={300} padding="1.8rem" margin="0" style={{ zIndex: 1 }}>
                      SHOWCASE AVAILABLE!{' '}
                      <TinyHelperText onClick={toggleMobileShowcase}>{`[+] What's showcase?`}</TinyHelperText>{' '}
                    </SubItemDescription>
                    {/* MOBILE SHOWCASE */}
                    {showShowcase && (
                      <SubItemDescription
                        backgroundColor="lightgoldenrodyellow"
                        color={BLACK}
                        onClick={toggleMobileShowcase}
                        padding="4rem 1.3rem 0.3rem"
                        margin="-3rem auto 0"
                        width="93%"
                        fontWeight={300}
                        fontSize="1.6rem"
                        style={{
                          cursor: 'pointer',
                          flexFlow: 'column nowrap',
                          alignItems: 'flex-start',
                          zIndex: Z_INDEXES.ZERO
                        }}
                      >
                        <small>
                          Use showcase to view merch of different sizes on different sized models
                          <ul>
                            <li>
                              Adjust the toggles below to set different parameters and load different product showcases
                            </li>
                            <li>Tap the video anywhere to play/pause.</li>
                          </ul>
                        </small>
                      </SubItemDescription>
                    )}
                    <SizeSelector color={bgColor} margin="2rem 0" />
                    <AddToCartButtonAndQuantitySelector merchandiseId={merchandiseId} />

                    <SubItemDescription margin={'2rem 0 0 0'} fontWeight={300}>
                      <img src={ShippingSvg} /> FREE SHIPPING OVER 200€
                    </SubItemDescription>
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
                </ItemContentContainer>
              </>
            )}
          </DynamicInnerContainer>
        </ItemAsidePanel>
        {isMobileShowcase || noVideo || catalogView ? null : (
          <ItemVideoContent
            firstPaintOver={firstPaintOver}
            videos={videos}
            currentCarouselIndex={currentCarouselIndex}
            zIndex={Z_INDEXES.BEHIND}
            height="100%"
          />
        )}
      </ItemContainer>
    </>
  )
}
