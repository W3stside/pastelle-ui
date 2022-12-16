import styled from 'styled-components/macro'
import { transparentize } from 'polished'
import { CarouselContainer, StaticCarouselStep } from 'components/Carousel/common/components/styleds'
import { ProductScreen, ProductLogo, ProductLogoCssImport, ProductScreensContainer } from 'pages/common/styleds'

import {
  upToLarge,
  upToSmall,
  fromLarge,
  fromExtraLarge,
  BLACK,
  setBackgroundWithDPI,
  CHARCOAL_BLACK
} from 'theme/utils'
import { STORE_IMAGE_SIZES, FIXED_IMAGE_SIZE_CONSTRAINTS } from 'constants/config'
import { GenericImageSrcSet } from 'shopify/graphql/types'

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
        
        > ${ProductScreen} {
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

      > ${CarouselContainer} {
        > ${StaticCarouselStep} {
          height: 100%;

          img {
            max-width: unset;
            height: 100%;
          }
        }
      }
`
