import { useCallback, useMemo, useRef, useState } from 'react'
import { Row } from 'components/Layout'
import Carousel from 'components/Carousel'
import {
  ItemContainer,
  ItemAsidePanel,
  ItemHeader,
  ItemDescription,
  ItemCredits,
  ItemArtistInfo,
  // FloatingStrip,
  PASTELLE_CREDIT,
  ItemSubHeader,
  ItemBreadcrumb
} from './styleds'

import { ApparelItem, CollaboratorSocialData, ItemSizes } from 'mock/apparel/types'
import { TYPE } from 'theme'
import { /* darken, */ transparentize } from 'polished'
import { useBreadcrumb } from 'components/Breadcrumb'

import Modal from 'components/Modal'
import { useToggleModal, useModalOpen } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { ItemVideoContent } from './ItemVideoContent'
import { useCatalogItemFromURL, useUpdateURLFromCatalogItem } from 'pages/Catalog/hooks'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import MainImage from 'components/MainImage'

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
}

const DEFAULT_MEDIA_START_INDEX = 0

// TODO: fix props, pass steps, sizes etc
export default function ItemPage({
  itemColor,
  itemHeader,
  itemLogo,
  itemMediaList,
  itemSizesList,
  itemDescription,
  itemArtistInfo,
  itemIndex,
  isActive,
  firstPaintOver,
  style
}: ItemPageProps & ScrollableContentComponentBaseProps & { style?: any }) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(DEFAULT_MEDIA_START_INDEX)
  const onCarouselChange = (index: number) => setCurrentCarouselIndex(index)

  // MODALS
  const toggleModal = useToggleModal(ApplicationModal.ITEM_LARGE_IMAGE)
  const showLargeImage = useModalOpen(ApplicationModal.ITEM_LARGE_IMAGE)

  // TODO: un-mock
  const { breadcrumbs, lastCrumb } = useBreadcrumb()

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

  // get catalog item from data and url
  const { seasonList, currentItem } = useCatalogItemFromURL()
  // update URL (if necessary) to reflect current item
  useUpdateURLFromCatalogItem({ seasonList, currentItem, isActive, itemIndex, itemKey: itemHeader })

  const asideRef = useRef<HTMLDivElement | null>(null)
  const getAsideWidth = useCallback(() => asideRef.current?.clientWidth, [])

  return (
    <ItemContainer id="#item-container" /* isViewingItem={isViewingItem} */ style={style}>
      <ItemAsidePanel id="#item-aside-panel" ref={asideRef}>
        {/* BREADCRUMBS */}
        <Row marginBottom={-25} style={{ zIndex: 100 }} padding="5px">
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
        {/* Item carousel */}
        <Carousel
          buttonColor={itemColor}
          imageList={smallImagesList}
          transformation={[{ width: itemMediaList[0].imageMedia.small }]}
          mediaStartIndex={currentCarouselIndex}
          onCarouselChange={onCarouselChange}
        />
        <br />
        <ItemHeader fontWeight={200} /* marginBottom={-55} */ marginTop={-55} itemColor={itemColor} animation>
          {itemLogo ? <MainImage path={itemLogo} transformation={[{ width: getAsideWidth() || 500 }]} /> : itemHeader}
        </ItemHeader>
        <br />
        <TYPE.black
          width="100%"
          padding={2}
          css={`
            > u {
              cursor: pointer;
            }
          `}
          onClick={toggleModal}
        >
          <u>[see full image +]</u>
        </TYPE.black>
        <br />
        {/* Credits */}
        <ItemSubHeader bgColor={transparentize(0.2, itemColor)}>CREDIT</ItemSubHeader>
        <ItemCredits>{itemArtistInfo ? <ItemArtistInfo {...itemArtistInfo} /> : PASTELLE_CREDIT}</ItemCredits>
        {/* Size selector */}
        <br />
        <ItemSubHeader bgColor={transparentize(0.2, itemColor)}>CHOOSE A SIZE</ItemSubHeader>
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
        <ItemSubHeader bgColor={transparentize(0.2, itemColor)}>DESCRIPTION</ItemSubHeader>
        <br />
        <Row>
          <ItemDescription>
            {itemDescription.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </ItemDescription>
        </Row>
        {/* VISUAL */}
        {/* <FloatingStrip
          color={transparentize(0.4, itemColor)}
          top={280}
          left={-106}
          rotation={15}
          gradientBase={darken(0.56, itemColor)}
          gradientEnd={transparentize(1, itemColor)}
        /> */}
      </ItemAsidePanel>
      {/*
       * Item Video content
       * Not displayed unless page content is on screen
       */}

      <ItemVideoContent
        firstPaintOver={firstPaintOver}
        hide={!isActive}
        itemMediaList={itemMediaList}
        currentCarouselIndex={currentCarouselIndex}
      />
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
