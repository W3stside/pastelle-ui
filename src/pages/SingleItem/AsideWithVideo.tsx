import { useEffect, useMemo, useState } from 'react'
import { Row } from 'components/Layout'
import Carousel from 'components/Carousel'
import {
  ItemContainer,
  ItemAsidePanel,
  ItemHeader as ItemLogo,
  ItemDescription,
  ItemCredits,
  ItemArtistInfo,
  // FloatingStrip,
  PASTELLE_CREDIT,
  ItemSubHeader,
  ItemBreadcrumb
} from './styleds'

import { ApparelItem, CollaboratorSocialData, ItemSizes } from 'mock/apparel/types'
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

export interface ItemPageProps {
  itemColor: string
  itemHeader: string
  itemLogo?: string
  itemMediaList: ApparelItem[]
  itemSizesList: ItemSizes[]
  itemDescription: string[]
  itemArtistInfo?: {
    artist: string
    social: CollaboratorSocialData
  }
  itemKey: string
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

export default function ItemPage({
  itemColor,
  itemHeader,
  itemLogo,
  itemMediaList,
  itemSizesList,
  itemDescription,
  itemArtistInfo,
  // TODO: reenable itemKey
  // itemKey,
  isActive,
  firstPaintOver,
  mobileView = false,
  noVideo = false,
  noDescription = false,
  showBreadCrumbs,
  style,
  handleMobileItemClick
}: ItemPageProps &
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

  // Split images lists
  const { smallImagesList, largeImagesList } = useMemo(() => {
    const smallImagesList: string[] = []
    const largeImagesList: string[] = []

    itemMediaList.forEach(({ imageMedia: { path } }) => {
      smallImagesList.push(path)
      largeImagesList.push(path)
    })

    return { smallImagesList, largeImagesList }
  }, [itemMediaList])

  // scrolling page current index set in state as on screen
  const setOnScreenId = useSetOnScreenItemID()
  useEffect(() => {
    if (isActive) {
      // TODO: reenable itemKey
      // setOnScreenId(itemKey)
      setOnScreenId(itemHeader)
    }
  }, [isActive, /* itemKey, */ itemHeader, setOnScreenId])

  return (
    <ItemContainer id="#item-container" style={style}>
      <ItemAsidePanel id="#item-aside-panel">
        {/* Breadcrumbs */}
        {showBreadCrumbs && <Breadcrumbs {...breadcrumbs} padding="5px" marginBottom={-25} />}
        {/* Item carousel */}
        <Carousel
          showCarouselContentIndicators={!mobileView}
          buttonColor={itemColor}
          imageList={smallImagesList}
          transformation={[{ width: itemMediaList[0].imageMedia.small }]}
          mediaStartIndex={currentCarouselIndex}
          onCarouselChange={onCarouselChange}
          onImageClick={toggleModal}
        />

        {/* Wrap everything else in a fragment */}
        {noDescription ? null : mobileView ? (
          <>
            <br />
            <ItemLogo fontWeight={200} marginTop={-55} marginBottom={-30} itemColor={itemColor} animation>
              {itemLogo ? <SmartImg path={itemLogo} transformation={[{ quality: 60 }]} /> : itemHeader}
            </ItemLogo>
            <Row
              style={{
                position: 'fixed',
                bottom: 0,
                height: 60,
                backgroundColor: 'lavender',
                fontSize: '40px',
                fontWeight: 100,
                width: '100%',
                color: '#000',
                letterSpacing: -3.5
              }}
              alignItems="center"
              justifyContent="center"
              onClick={handleMobileItemClick && handleMobileItemClick}
            >
              TAP TO <strong style={{ marginLeft: 7 }}> VIEW MORE</strong>
            </Row>
          </>
        ) : (
          <>
            <br />
            <ItemLogo fontWeight={200} marginTop={-135} marginBottom={-30} itemColor={itemColor} animation>
              {itemLogo ? <SmartImg path={itemLogo} transformation={[{ quality: 60 }]} /> : itemHeader}
            </ItemLogo>

            <br />

            {/* Credits */}
            <ItemSubHeader bgColor={itemColor}>
              <span style={{ fontWeight: 500, color: getThemeColours(ThemeModes.CHAMELEON).white }}>CREDIT</span>
            </ItemSubHeader>

            <ItemCredits>{itemArtistInfo ? <ItemArtistInfo {...itemArtistInfo} /> : PASTELLE_CREDIT}</ItemCredits>

            <br />

            {/* Size selector */}
            <ItemSubHeader bgColor={itemColor}>
              <span style={{ fontWeight: 500, color: getThemeColours(ThemeModes.CHAMELEON).white }}>CHOOSE A SIZE</span>
            </ItemSubHeader>

            <br />

            <Row>
              <select disabled style={{ width: '50%' }}>
                {itemSizesList.map((size, index) => (
                  <option key={size + '_' + index}>{size}</option>
                ))}
              </select>
            </Row>

            <br />

            {/* Item description */}
            <ItemSubHeader bgColor={itemColor}>
              <span style={{ fontWeight: 500, color: getThemeColours(ThemeModes.CHAMELEON).white }}>DESCRIPTION</span>
            </ItemSubHeader>

            <br />

            <Row>
              <ItemDescription>
                {itemDescription.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </ItemDescription>
            </Row>
          </>
        )}
      </ItemAsidePanel>
      {noVideo ? null : (
        <ItemVideoContent
          firstPaintOver={firstPaintOver}
          hide={!isActive}
          itemMediaList={itemMediaList}
          currentCarouselIndex={currentCarouselIndex}
        />
      )}

      {/* LARGE IMAGE MODAL */}
      <Modal isOpen={isActive && showLargeImage} onDismiss={toggleModal} isLargeImageModal={true}>
        <Carousel
          buttonColor={itemColor}
          imageList={largeImagesList}
          transformation={[{ width: itemMediaList[0].imageMedia.large }]}
          mediaStartIndex={currentCarouselIndex}
          onCarouselChange={onCarouselChange}
          fixedHeight="auto"
        />
      </Modal>
    </ItemContainer>
  )
}
