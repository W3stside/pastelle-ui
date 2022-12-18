import styled from 'styled-components/macro'
import { transparentize } from 'polished'
import { CarouselContainer, StaticCarouselStep } from 'components/Carousel/common/components/styleds'
import {
  ProductScreen,
  ProductLogo,
  ProductLogoCssImport,
  ProductScreensContainer,
  ProductContainer
} from 'pages/common/styleds'
import { Column } from 'components/Layout'

import {
  upToLarge,
  upToSmall,
  fromLarge,
  fromExtraLarge,
  BLACK,
  setBackgroundWithDPI,
  CHARCOAL_BLACK,
  betweenSmallAndLarge,
  upToSmallHeight
} from 'theme/utils'
import { STORE_IMAGE_SIZES, FIXED_IMAGE_SIZE_CONSTRAINTS } from 'constants/config'
import { LAYOUT_REM_HEIGHT_MAP, SIZE_RATIOS } from 'constants/sizes'
import { GenericImageSrcSet } from 'shopify/graphql/types'

export const SingleProductScreen = styled(ProductScreen)`
  ${upToSmall`
    height: calc(100vh - ${LAYOUT_REM_HEIGHT_MAP.HEADER}rem);
    > ${Column} {
      padding: 0 1rem;
    }
  `}

  ${upToSmallHeight`
    height: 100%;
  `}

  > ${CarouselContainer} {
    min-height: 443px;
    ${upToSmall`
      min-height: 100vw;
      height: 100%;
      height: calc(100vh - (calc(75% * 20 / 73) + 70px));
    `}
    ${StaticCarouselStep} {
      height: 100%;

      // TODO: TESTING THIS STYLE
      picture {
        height: 100%;
        img {
          // height: 100%;
          // max-width: unset;
          max-width: 100%;
        }
      }
    }
  }
`

export const SingleProductContainer = styled(ProductContainer)<{ parentAspectRatio?: number }>`
  ${({ parentAspectRatio }) =>
    parentAspectRatio &&
    parentAspectRatio < SIZE_RATIOS[169].landscape * 0.85 &&
    betweenSmallAndLarge`
      // 16:9 (HORIZONTAL LANDSCAPE) size
      height: calc(100% * 9 / 16 * 1.35);
      margin: auto;
    `}
`

// wraps all the single product page "screens" e.g carousel + label // showcase // descriptions
export const SingleProductScreensContainer = styled(ProductScreensContainer)<{
  bgColor?: string
  navLogo?: GenericImageSrcSet
  logo?: GenericImageSrcSet
}>`
  max-width: ${STORE_IMAGE_SIZES.SMALL}px;
  box-shadow: 1rem 0px 5rem 0.5rem ${({ theme }) => transparentize(0.5, theme.black)};

  ${upToLarge`
    max-width: 40vw; 
    min-width: 36rem;
  `}

  ${upToSmall`
    max-width: 100%;
    min-width: unset;
    // corresponds with @supports not above in itemAsidePanel
    @supports (overflow:clip) {
      overflow-x: clip;
    }
    
    > ${SingleProductScreen} {
      padding-left: 0;
      padding-right: 0;
    }
  `}

  ${fromLarge`
    max-width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromLarge}; 
  `}

  ${fromExtraLarge`
    max-width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromExtraLarge};
  `}

  ${ProductLogo} {
    width: 100%;
    margin-top: -18.5%;
    
    // for mobile logos in single
    &${ProductLogoCssImport} {
      margin-top: -15.1%;
    }
    padding-top: 2rem;
    filter: ${({ theme }) => theme.darkModeLogoFilter};

    ${fromLarge`
      width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromLarge};
    `}
    ${fromExtraLarge`
      width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromExtraLarge};
    `}

    > img {
      margin: 0;
    }
  }
      
  ${({ theme, bgColor = BLACK, navLogo }) =>
    navLogo
      ? setBackgroundWithDPI(theme, navLogo, {
          ignoreQueriesWithFixedWidth: 960,
          backgroundAttributes: ['center / cover no-repeat', '36px / cover repeat'],
          backgroundBlendMode: 'difference',
          modeColours: [bgColor, CHARCOAL_BLACK]
        })
      : `background: linear-gradient(${bgColor} 30%, ${transparentize(0.3, theme.white)} 55%);`}
`
