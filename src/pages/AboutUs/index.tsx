import styled from 'styled-components/macro'

import { AutoColumn, Row } from 'components/Layout'
import { MarkdownRenderer } from 'components/Markdown'

import { CatalogContainer } from 'pages/Catalog'
import { ItemAsidePanel, ItemContainer, ItemHeader } from 'pages/SingleItem/styleds'

import { TYPE } from 'theme'
import { ThemeModes } from 'theme/styled'
import { getThemeColours } from 'theme/utils'
// assets
import david from 'assets/images/aboutus/david.jpeg'
import felix_david from 'assets/images/aboutus/felix_david_train_cropped.jpg'
// markdown
import AboutUsContent from 'markdown/AboutUs.md'

const AboutUsContainer = styled(ItemContainer)`
  > ${ItemAsidePanel} {
    max-width: 665px;
  }
`

const ScrollableImagesContainer = styled(AutoColumn)`
  width: 100%;
  overflow-y: auto;

  > img {
    max-width: 100%;
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

export default function AboutUs() {
  return (
    <CatalogContainer>
      <AboutUsContainer id="#item-container" /* isViewingItem={isViewingItem} */>
        <ItemAsidePanel>
          <AboutUsHeader itemColor={getThemeColours(ThemeModes.VAMPIRE).bg2} animation>
            ABOUT US
          </AboutUsHeader>
          <AboutUsTextContainer>
            <TYPE.black fontSize={18} padding={2} fontWeight={300}>
              <MarkdownRenderer contentFile={AboutUsContent} />
            </TYPE.black>
          </AboutUsTextContainer>
        </ItemAsidePanel>
        <ScrollableImagesContainer>
          <img src={felix_david} />
          <img src={david} />
        </ScrollableImagesContainer>
      </AboutUsContainer>
    </CatalogContainer>
  )
}
