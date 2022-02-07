import { ReactNode, useState } from 'react'
import { Row } from 'components/Layout'
import Carousel from 'components/Carousel'
import {
  ItemContainer,
  ItemAsidePanel,
  ItemHeader,
  VideoContentWrapper,
  ItemCredits,
  ItemArtistInfo,
  FloatingStrip,
  PASTELLE_CREDIT,
  ItemSubHeader,
  ItemBreadcrumb
} from './styleds'

import { ApparelItem } from 'mock/apparel/types'
import { TYPE } from 'theme'
import { darken, transparentize } from 'polished'
import { useBreadcrumb } from 'components/Breadcrumb'

// TODO: move to APPAREL TYPES or sth
type ItemSizes = 'XX-LARGE' | 'X-LARGE' | 'LARGE' | 'MEDIUM' | 'SMALL'

export interface ItemPageProps {
  itemColor: string
  itemHeader: string
  itemMediaList: ApparelItem[]
  itemSizesList: ItemSizes[]
  itemDescription: ReactNode
  itemArtistInfo?: {
    artist: string
    social: string
  }
}

const DEFAULT_MEDIA_START_INDEX = 0

// TODO: fix props, pass steps, sizes etc
export default function ItemPage({
  itemColor,
  itemHeader,
  itemMediaList,
  itemSizesList,
  itemDescription,
  itemArtistInfo
}: ItemPageProps) {
  const [mediaStartIndex, setMediaStartIndex] = useState(DEFAULT_MEDIA_START_INDEX)
  const onCarouselChange = (index: number) => setMediaStartIndex(index)

  // TODO: un-mock
  const { breadcrumbs, lastCrumb } = useBreadcrumb()

  return (
    <ItemContainer>
      <ItemAsidePanel id="#shirt-aside-panel">
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
          mediaList={itemMediaList}
          mediaStartIndex={mediaStartIndex}
          onCarouselChange={onCarouselChange}
        />
        <br />
        <ItemHeader
          fontSize="100px"
          fontWeight={200}
          /* marginBottom={-55} */ marginTop={-55}
          itemColor={itemColor}
          animation
        >
          {/* <Strikethrough /> */}
          {itemHeader}
        </ItemHeader>
        <br />
        <ItemSubHeader bgColor={transparentize(0.2, itemColor)}>CREDIT</ItemSubHeader>
        {/* Credits */}
        <ItemCredits>{itemArtistInfo ? <ItemArtistInfo {...itemArtistInfo} /> : PASTELLE_CREDIT}</ItemCredits>
        {/* Size selector */}
        <br />
        <ItemSubHeader bgColor={transparentize(0.2, itemColor)}>CHOOSE A SIZE</ItemSubHeader>
        <br />
        <Row>
          <select style={{ width: '50%' }}>
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
          <TYPE.black fontSize={18} padding={2} fontWeight={300}>
            {itemDescription}
          </TYPE.black>
        </Row>
        {/* VISUAL */}
        <FloatingStrip
          color={transparentize(0.4, itemColor)}
          top={280}
          left={-106}
          rotation={15}
          gradientBase={darken(0.56, itemColor)}
          gradientEnd={transparentize(1, itemColor)}
        />
      </ItemAsidePanel>
      {/* Item Video content */}
      <VideoContentWrapper id="#video-content-wrapper">
        {itemMediaList.map(({ video }, index) => {
          const isSelected = index === mediaStartIndex
          if (!isSelected) return null

          return (
            <video loop muted autoPlay key={index}>
              <source src={video} type="video/webm" />
            </video>
          )
        })}
      </VideoContentWrapper>
    </ItemContainer>
  )
}
