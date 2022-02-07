import { ReactNode, useState } from 'react'
import styled from 'styled-components/macro'
import { Row } from 'components/Layout'
import Carousel from 'components/Carousel'
import {
  ItemContainer,
  ItemAsidePanel,
  ItemHeader,
  VideoContentWrapper,
  ItemCredits,
  ItalicStrikethrough,
  ItemArtistInfo,
  FloatingStrip
} from './styleds'

import { ApparelItem } from 'mock/apparel/types'
import { TYPE } from 'theme'
import { darken, transparentize } from 'polished'

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

const PASTELLE_CREDIT = (
  <>
    Homegrown at <ItalicStrikethrough>PASTELLE</ItalicStrikethrough> labs
  </>
)
const DEFAULT_MEDIA_START_INDEX = 0

export const ItemSubHeader = styled(TYPE.black).attrs(() => ({
  fontSize: 16,
  padding: 2,
  fontWeight: 200,
  fontStyle: 'italic'
}))<{ bgColor?: string }>`
  background: ${({ bgColor = 'transparent' }) =>
    `linear-gradient(90deg, ${bgColor} 0%, ${transparentize(0.3, bgColor)} 35%, transparent 70%)`};
  width: 100%;
`

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

  return (
    <ItemContainer>
      <ItemAsidePanel id="#shirt-aside-panel">
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
        <ItemSubHeader bgColor={itemColor}>CREDIT</ItemSubHeader>
        {/* Credits */}
        <ItemCredits>{itemArtistInfo ? <ItemArtistInfo {...itemArtistInfo} /> : PASTELLE_CREDIT}</ItemCredits>
        {/* Size selector */}
        <br />
        <ItemSubHeader bgColor={itemColor}>CHOOSE A SIZE</ItemSubHeader>
        <br />
        <Row>
          <select>
            {itemSizesList.map((size, index) => (
              <option key={size + '_' + index}>{size}</option>
            ))}
          </select>
        </Row>
        <br />
        {/* Item description */}
        <ItemSubHeader bgColor={itemColor}>DESCRIPTION</ItemSubHeader>
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
          gradientEnd={itemColor}
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
