import { useEffect, useMemo, useState } from 'react'
import { Row } from 'components/Layout'
import Carousel, { GenericImageSrcSet } from 'components/Carousel'
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
  ItemContentContainer
} from './styleds'

import { useBreadcrumb } from 'components/Breadcrumb'

import Modal from 'components/Modal'
import { useToggleModal, useModalOpen } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { ItemVideoContent } from './ItemVideoContent'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import { BoxProps } from 'rebass'
import SmartImg from 'components/SmartImg'
import { useSetOnScreenItemID } from 'state/user/hooks'
import { TYPE } from 'theme'
import { isMobile } from 'utils'
import {
  FragmentProductVideoFragment,
  FragmentProductImageFragment,
  ProductSizes,
  ProductArtistInfo
} from 'shopify/graphql/types'
import useStateRef from 'hooks/useStateRef'
import SizeSelector from 'components/SizeSelector'
import { STORE_IMAGE_SIZES } from 'constants/config'

export interface ProductPageProps {
  bgColor: string
  color: string
  title: string
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
  color = '#000',
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
  const showLargeImage = useModalOpen(ApplicationModal.ITEM_LARGE_IMAGE)

  /// BREADCRUMBS
  const breadcrumbs = useBreadcrumb()

  // IMAGES
  const imageUrls = images.map<GenericImageSrcSet>(({ url, url500, url720, url960, url1280 }) => ({
    defaultUrl: url,
    '500': url500,
    '720': url720,
    '960': url960,
    '1280': url1280
  }))

  /**
   * SIDE EFFECTS
   */
  // 1. scrolling page current index set in state as on screen
  const setOnScreenId = useSetOnScreenItemID()
  useEffect(() => {
    if (isActive) {
      // TODO: use id
      setOnScreenId(title)
    }
  }, [isActive, title, setOnScreenId])

  // inner container ref
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, node => node)

  const DynamicInnerContainer = useMemo(() => (catalogView ? InnerCatalogContainer : InnerContainer), [catalogView])

  // catalog display logo to use
  const catalogLogo = navLogo || headerLogo

  return (
    <ItemContainer id="#item-container" style={style} catalogView={catalogView} bgColor={color}>
      <ItemAsidePanel id="#item-aside-panel">
        <DynamicInnerContainer ref={setRef}>
          {/* Breadcrumbs */}
          {showBreadCrumbs && <Breadcrumbs {...breadcrumbs} marginTop={'5px'} marginLeft={'5px'} marginBottom={-25} />}
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
                {isMobile ? 'TAP' : 'CLICK'} TO <strong style={{ marginLeft: 7 }}> VIEW MORE</strong>
              </MobileItemCTA>
            </>
          ) : (
            <>
              <ItemLogo>
                {logo ? (
                  <SmartImg
                    ikPath={logo}
                    transformation={[{ width: innerContainerRef?.clientWidth, quality: 80, pr: true }]}
                    loading="lazy"
                    lq
                  />
                ) : (
                  title
                )}
              </ItemLogo>

              {/* ITEM CONTENT: description, credits, etc */}
              <ItemContentContainer padding={'0 10px'}>
                {/* Credits */}
                <ItemSubHeader useGradient bgColor={color} label="... CREDIT" />
                <ItemCredits>
                  {artistInfo ? (
                    <ItemArtistInfo {...artistInfo} bgColor={color} />
                  ) : (
                    <HighlightedText bgColor={color}>{PASTELLE_CREDIT}</HighlightedText>
                  )}
                </ItemCredits>

                {/* Size selector */}
                <ItemSubHeader useGradient bgColor={color} label="CHOOSE A SIZE AND VIEW ITEM ON MODEL" />
                <SizeSelector sizes={sizes} color={color} margin="20px 0" />
                <Row>
                  <ItemDescription>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. In
                    ornare quam viverra orci sagittis eu volutpat odio facilisis. In eu mi bibendum neque egestas congue
                    quisque egestas.
                    <br />
                    <br />
                    Et molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit. Mauris sit amet massa vitae
                    tortor. Augue lacus viverra vitae congue eu consequat ac. Nunc mi ipsum faucibus vitae aliquet. Nibh
                    ipsum consequat nisl vel pretium lectus quam id. Et magnis dis parturient montes. Semper auctor
                    neque vitae tempus. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Sed
                    felis eget velit aliquet sagittis. Ullamcorper a lacus vestibulum sed. Ut pharetra sit amet aliquam
                    id diam maecenas ultricies mi.
                  </ItemDescription>
                </Row>

                {/* Item description */}
                <ItemSubHeader useGradient bgColor={color} label="MERCH DESCRIPTION AND CARE INSTRUCTIONS" />
                <Row>
                  <TYPE.black padding={'10px'}>
                    <ItemDescription dangerouslySetInnerHTML={{ __html: description }}></ItemDescription>
                  </TYPE.black>
                </Row>
              </ItemContentContainer>
            </>
          )}
        </DynamicInnerContainer>
      </ItemAsidePanel>
      {noVideo || catalogView ? null : (
        <ItemVideoContent firstPaintOver={firstPaintOver} videos={videos} currentCarouselIndex={currentCarouselIndex} />
      )}

      {/* LARGE IMAGE MODAL */}
      <Modal isOpen={isActive && showLargeImage} onDismiss={toggleModal} isLargeImageModal>
        <Carousel
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
      </Modal>
    </ItemContainer>
  )
}
