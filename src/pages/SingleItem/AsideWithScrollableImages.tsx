import { ReactNode } from 'react'
import styled from 'styled-components/macro'
import { AutoColumn, Row } from 'components/Layout'
import { MarkdownRenderer } from 'components/Markdown'
import { TYPE } from 'theme'
import { ThemeModes } from 'theme/styled'
import { getThemeColours } from 'theme/utils'
import { ItemContainer, ItemAsidePanel, ItemHeader } from './styleds'
import MainImage, { ImageKitTransformation } from 'components/MainImage'

const AsideWithScrollableImagesContainer = styled(ItemContainer)`
  > ${ItemAsidePanel} {
    width: 40vw;
    max-width: 40vw;
  }
`

const ImageContainer = styled(AutoColumn)`
  width: 100%;
  overflow-y: auto;

  > img {
    height: 100vh;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

const AboutUsHeader = styled(ItemHeader)`
  font-size: 70px;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 45px;
  `}
`

const AboutUsTextContainer = styled(Row)`
  padding: 0px 25px;
`

interface Params {
  header: ReactNode
  markdown: string
  image: { path: string; transformation?: ImageKitTransformation }
  key: string
}

export function AsideWithScrollableImages({ header, markdown, image }: Params) {
  return (
    <AsideWithScrollableImagesContainer id="#item-container" /* isViewingItem={isViewingItem} */>
      <ItemAsidePanel>
        <AboutUsHeader itemColor={getThemeColours(ThemeModes.VAMPIRE).bg2} animation>
          {header}
        </AboutUsHeader>
        <AboutUsTextContainer>
          <TYPE.black fontSize={18} padding={2} fontWeight={300}>
            <MarkdownRenderer filePath={markdown} />
          </TYPE.black>
        </AboutUsTextContainer>
      </ItemAsidePanel>
      <ImageContainer>
        <MainImage path={image.path} transformation={image.transformation} />
      </ImageContainer>
    </AsideWithScrollableImagesContainer>
  )
}
