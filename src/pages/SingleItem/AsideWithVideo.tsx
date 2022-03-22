import { useMemo, useState } from 'react'
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
import { useCatalogItemFromURL, useUpdateURLFromCatalogItem } from 'pages/Catalog/hooks'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import { ThemeModes } from 'theme/styled'
import { getThemeColours } from 'theme/utils'
import { BoxProps } from 'rebass'
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

  // get catalog item from data and url
  const { seasonList, currentItem } = useCatalogItemFromURL()
  // update URL (if necessary) to reflect current item
  useUpdateURLFromCatalogItem({ seasonList, currentItem, isActive, itemIndex, itemKey: itemHeader })

  return (
    <ItemContainer id="#item-container" /* isViewingItem={isViewingItem} */ style={style}>
      <ItemAsidePanel id="#item-aside-panel">
        {/* Breadcrumbs */}
        <Breadcrumbs {...breadcrumbs} padding="5px" marginBottom={-25} />

        {/* Item carousel */}
        <Carousel
          buttonColor={itemColor}
          imageList={smallImagesList}
          transformation={[{ width: itemMediaList[0].imageMedia.small }]}
          mediaStartIndex={currentCarouselIndex}
          onCarouselChange={onCarouselChange}
          onImageClick={toggleModal}
        />

        <br />

        <ItemLogo fontWeight={200} marginTop={-90} marginBottom={-35} itemColor={itemColor} animation>
          {itemLogo ? <MainImage path={itemLogo} transformation={[{ quality: 60 }]} /> : itemHeader}
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
      </ItemAsidePanel>
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
