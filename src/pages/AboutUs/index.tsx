import styled from 'styled-components/macro'
import { AutoColumn, Row } from 'components/Layout'
import { CatalogContainer } from 'pages/Catalog'
import { ItemAsidePanel, ItemContainer, ItemHeader } from 'pages/SingleItem/styleds'
import { TYPE } from 'theme'
import { ThemeModes } from 'theme/styled'
import { getThemeColours } from 'theme/utils'

import david from 'assets/images/aboutus/david.jpeg'
import felix_david from 'assets/images/aboutus/felix_david_train_cropped.jpg'

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
              Mentally established at the peak of fidget spinners, and legally established in 2022, Pastelle is
              headquarted in Lisboa, with Portugal standing firmly as the base of operations for the complete lifecycle
              of our streetwear.
              <br />
              <br />
              The goal here is pretty simple. We make, and want to continue to make, high quality apparel that not only
              feels solid, but embodies a unique and wholly bespoke feel that sets us apart from the noise. Design
              starts here in LX, then production and logistics is handled up North in Porto. Somewhere in between
              we&apos;re driving up and down to get shirts out and into your hands.
              <br />
              <br />
              Oh and a note on designs - we collab with smaller, local artists and work together to make every design.
              We know more than anyone that you&apos;re not trying to wear the same shit the next fourteen dudes all
              already wore... so we&apos;re already built out to integrate NFTs with every purchase. Now you can swag
              out and we&apos;ll kit you out with the authenticity to boot.
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
