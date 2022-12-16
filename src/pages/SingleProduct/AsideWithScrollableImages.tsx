import { ReactNode } from 'react'
import styled from 'styled-components/macro'
import { AutoColumn, Row } from 'components/Layout'
import { MarkdownRenderer } from 'components/Markdown'
import { TYPE } from 'theme'
import { getThemeColours } from 'theme/utils'
import { ProductContainer, ProductAsidePanel, ItemHeader } from '../common/styleds'
import SmartImg, { ImageKitTransformation } from 'components/SmartImg'
import { ThemeModes } from 'theme/styled'

const ImageContainer = styled(AutoColumn)`
  overflow-y: auto;

  > img {
    height: 100vh;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

const AsideWithScrollableImagesContainer = styled(ProductContainer)`
  > ${ProductAsidePanel}, > ${ImageContainer} {
    width: 700px;
    max-width: 100%;
  }

  > ${ProductAsidePanel} {
    padding: 30px 0;
  }
`

const AboutUsHeader = styled(ItemHeader)`
  font-size: 7rem;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 4.5rem;
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
      <ProductAsidePanel>
        <AboutUsHeader fontWeight={100} itemColor={getThemeColours(ThemeModes.DARK).bg2} animation>
          {header}
        </AboutUsHeader>
        <AboutUsTextContainer>
          <TYPE.black fontSize={18} padding={2} fontWeight={300}>
            <MarkdownRenderer filePath={markdown} />
          </TYPE.black>
        </AboutUsTextContainer>
      </ProductAsidePanel>
      <ImageContainer>
        <SmartImg path={{ defaultPath: image.path }} transformation={image.transformation} />
      </ImageContainer>
    </AsideWithScrollableImagesContainer>
  )
}
