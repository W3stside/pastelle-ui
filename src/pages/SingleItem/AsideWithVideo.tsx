import { SyntheticEvent, useEffect, useState } from 'react'
import { Row } from 'components/Layout'
import Carousel from 'components/Carousel'
import {
  ItemContainer,
  ItemAsidePanel,
  ItemLogo,
  ItemDescription,
  ItemCredits,
  ItemArtistInfo,
  // FloatingStrip,
  PASTELLE_CREDIT,
  ItemSubHeader,
  ItemBreadcrumb,
  MobileItemCTA,
  InnerContainer,
  HighlightedText,
  ItemLogoCssImport
} from './styleds'

import { useBreadcrumb } from 'components/Breadcrumb'

import Modal from 'components/Modal'
import { useToggleModal, useModalOpen } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { ItemVideoContent } from './ItemVideoContent'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import { ThemeModes } from 'theme/styled'
import { getThemeColours } from 'theme/utils'
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

export interface ProductPageProps {
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
  mobileView?: boolean
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
    <Row {...rowProps} style={{ zIndex: 100 }}>
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
const DEFAULT_SIZE_SELECTED: ProductSizes = ProductSizes.M

export default function ItemPage({
  color = '#000',
  title,
  logo,
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
  mobileView = false,
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

  const breadcrumbs = useBreadcrumb()

  const [, setSize] = useState<ProductSizes>(DEFAULT_SIZE_SELECTED)
  const handleSetSize = (event: SyntheticEvent<HTMLOptionElement>) => setSize(event.currentTarget.value as ProductSizes)

  const imageUrls = images.map(image => image.url)

  // scrolling page current index set in state as on screen
  const setOnScreenId = useSetOnScreenItemID()
  useEffect(() => {
    if (isActive) {
      // TODO: use id
      setOnScreenId(title)
    }
  }, [isActive, title, setOnScreenId])

  return (
    <ItemContainer id="#item-container" style={style} mobileView={mobileView} bgColor={color}>
      <ItemAsidePanel id="#item-aside-panel">
        <InnerContainer>
          {/* Breadcrumbs */}
          {showBreadCrumbs && <Breadcrumbs {...breadcrumbs} padding="5px" marginBottom={-25} />}
          {/* Item carousel */}
          <Carousel
            showCarouselContentIndicators={!mobileView}
            buttonColor={color}
            imageList={imageUrls}
            // TODO: kinda irrelevant rn since shopify CDN
            transformation={[{ width: (images[0]?.width || 2000) / 2, height: (images[0]?.height || 2000) / 2 }]}
            mediaStartIndex={currentCarouselIndex}
            onCarouselChange={onCarouselChange}
            onImageClick={toggleModal}
            loadInViewOptions={loadInView}
          />

          {/* Wrap everything else in a fragment */}
          {noDescription ? null : mobileView ? (
            <>
              <br />
              {/* <ItemLogo>
                {logo ? (
                  <SmartImg
                    path={logo}
                    transformation={[{ quality: 60 }]}
                    loadInView={{ container: document, conditionalCheck: firstPaintOver }}
                  />
                ) : (
                  title
                )}
              </ItemLogo> */}
              {logo ? <ItemLogoCssImport logoUri={logo} /> : <ItemLogo>{title}</ItemLogo>}
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
              <ItemLogo>{logo ? <SmartImg path={logo} transformation={[{ quality: 60 }]} /> : title}</ItemLogo>

              {/* Credits */}
              <ItemSubHeader bgColor={color}>
                <span style={{ fontWeight: 500, color: getThemeColours(ThemeModes.CHAMELEON).white }}>CREDIT</span>
              </ItemSubHeader>

              <ItemCredits>
                {artistInfo ? (
                  <ItemArtistInfo {...artistInfo} bgColor={color} />
                ) : (
                  <HighlightedText bgColor={color}>{PASTELLE_CREDIT}</HighlightedText>
                )}
              </ItemCredits>

              {/* Size selector */}
              <ItemSubHeader bgColor={color}>
                <span style={{ fontWeight: 500, color: getThemeColours(ThemeModes.CHAMELEON).white }}>
                  CHOOSE A SIZE
                </span>
              </ItemSubHeader>

              <br />

              <Row>
                <select disabled style={{ width: '50%' }}>
                  {sizes.map((size, index) => (
                    <option key={size + '_' + index} onChange={handleSetSize}>
                      {size}
                    </option>
                  ))}
                </select>
              </Row>

              <br />

              {/* Item description */}
              <ItemSubHeader bgColor={color}>
                <span style={{ fontWeight: 500, color: getThemeColours(ThemeModes.CHAMELEON).white }}>DESCRIPTION</span>
              </ItemSubHeader>

              <Row>
                <TYPE.black padding={2}>
                  <ItemDescription dangerouslySetInnerHTML={{ __html: description }}></ItemDescription>
                </TYPE.black>
              </Row>
            </>
          )}
        </InnerContainer>
      </ItemAsidePanel>
      {noVideo ? null : (
        <ItemVideoContent firstPaintOver={firstPaintOver} videos={videos} currentCarouselIndex={currentCarouselIndex} />
      )}

      {/* LARGE IMAGE MODAL */}
      <Modal isOpen={isActive && showLargeImage} onDismiss={toggleModal} isLargeImageModal={true}>
        <Carousel
          buttonColor={color}
          imageList={imageUrls}
          transformation={[{ width: images[0]?.width || 2000, height: images[0]?.height || 2000, xc: 500, yc: 500 }]}
          mediaStartIndex={currentCarouselIndex}
          onCarouselChange={onCarouselChange}
          fixedHeight="auto"
        />
      </Modal>
    </ItemContainer>
  )
}
