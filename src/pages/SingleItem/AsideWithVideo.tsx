import { useEffect, useMemo, useState } from 'react'
import { Row } from 'components/Layout'
import Carousel from 'components/Carousel'
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

import { useToggleModal, useModalOpen, useCloseModals } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { ItemVideoContent } from './ItemVideoContent'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import { BoxProps } from 'rebass'
import SmartImg from 'components/SmartImg'
import { useSetOnScreenProductHandle } from 'state/user/hooks'
import {
  FragmentProductVideoFragment,
  FragmentProductImageFragment,
  ProductSizes,
  ProductArtistInfo
} from 'shopify/graphql/types'
import useStateRef from 'hooks/useStateRef'
import SizeSelector from 'components/SizeSelector'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { getImageSizeMap } from 'shopify/utils'
import LargeImageCarouselModal from 'components/LargeImageCarouselModal'
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
  sizes: ProductSizes[]
  description: string
  artistInfo?: ProductArtistInfo
  id: string
  catalogView?: boolean
  noVideo?: boolean
  noDescription?: boolean
}

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
}: ProductPageProps &
  ScrollableContentComponentBaseProps & {
    style?: any
    handleMobileItemClick?: React.MouseEventHandler<HTMLHeadingElement>
    showBreadCrumbs: boolean
  }) {
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
  const setOnScreenProductHandle = useSetOnScreenProductHandle()
  useEffect(() => {
    if (isActive) {
      setOnScreenProductHandle({ handle, id })
    }
  }, [isActive, handle, id, setOnScreenProductHandle])

  // inner container ref
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, node => node)

  const DynamicInnerContainer = useMemo(() => (catalogView ? InnerCatalogContainer : InnerContainer), [catalogView])

  // catalog display logo to use
  const catalogLogo = navLogo || headerLogo

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
                  <ItemContentContainer margin="20px 0" padding={'0 3rem'}>
                    <SubItemDescription>SELECT A SIZE BELOW TO SEE IT ON THE MODEL</SubItemDescription>
                    <SizeSelector sizes={sizes} color={bgColor} margin="20px 0" />

                    <SubItemDescription>
                      **Showcase is meant to help you see what your merch in the selected size looks like on an actual
                      person similar to your size.
                      <br />
                      <br />
                      Compare that to using some dumb fucking sizing chart that never works, AND requires measuring tape
                      that literally zero people on this planet own.
                    </SubItemDescription>

                    <SubItemDescription>
                      <img src={ShippingSvg} /> FREE SHIPPING OVER 200€
                    </SubItemDescription>
                  </ItemContentContainer>

                  {/* Item description */}
                  <ItemSubHeader useGradient bgColor={color} label="INFO + CARE INSTRUCTIONS" />
                  <ItemContentContainer padding={'0 3rem'}>
                    <ItemDescription dangerouslySetInnerHTML={{ __html: description }}></ItemDescription>
                  </ItemContentContainer>
                </ItemContentContainer>
              </>
            )}
          </DynamicInnerContainer>
        </ItemAsidePanel>
        {noVideo || catalogView ? null : (
          <ItemVideoContent
            firstPaintOver={firstPaintOver}
            videos={videos}
            currentCarouselIndex={currentCarouselIndex}
          />
        )}
      </ItemContainer>
    </>
  )
}
