import styled from 'styled-components/macro'
import { transparentize } from 'polished'
import { CarouselContainer, StaticCarouselStep } from 'components/Carousel/common/components/styleds'
import { AnimatedDivContainer } from 'components/ScrollingContentPage/styleds'
import { ProductScreen, ProductLogo, ProductLogoCollectionView, ProductScreensContainer } from 'pages/common/styleds'
import { Z_INDEXES } from 'constants/config'
import {
  upToSmall,
  upToLarge,
  fromLarge,
  fromMedium,
  fromExtraLarge,
  betweenSmallAndLarge,
  fromSmall
} from 'theme/utils'

export const CollectionScreensContainer = styled(ProductScreensContainer)`
  ${upToSmall`
  padding: 0;
  `}
  ${upToLarge`
  height: 100%;
  max-width: 100%;
  `}
  ${fromLarge`
  overflow: hidden;
  width: 100%;
  max-width: unset;
  `}
  
  > ${ProductScreen} {
    > ${ProductLogo} {
      margin-top: 0px;
    }

    > ${CarouselContainer} {
      ${upToSmall`
        margin: 7rem 0 0;
        > ${AnimatedDivContainer} {
          picture {
            margin-top: -3.5rem;
          }
        }
      `}
      ${fromMedium`  
        margin-top: 2rem;
      `}
      ${fromLarge`  
        justify-content: space-between;
        overflow: visible;
      `}

      > ${StaticCarouselStep} {
        position: relative;
        height: 100%;

        > picture {
            overflow: hidden; 

            img {
              max-width: unset;
              height: 100%;
            }
          }

        &:first-child {
          box-shadow: 1rem 0px 5rem 0.5rem ${({ theme }) => transparentize(0.5, theme.black)};

          > picture {
            border-radius: 1rem 0 0 1rem;

            ${upToSmall`
              border-radius: 0rem;
            `}

            ${fromExtraLarge`
              margin-right: auto;
            `}
          }
        }

        &:last-child {
          box-shadow: 1rem 0px 5rem 0.5rem ${({ theme }) => transparentize(0.5, theme.black)};

          > picture {
            border-radius: 0 1rem 1rem 0;
            
            ${upToSmall`
              border-radius: 0rem;
              display: none;
            `}

            ${fromExtraLarge`
              margin-left: auto;
            `}
          }
        }

        ${upToSmall`
          width: auto;
          justify-content: center;            
          :not(:first-child) {
            position: absolute;
            visibility: hidden;
            transform: none;
            z-index: ${Z_INDEXES.ZERO};
          }
        `}

        ${({ theme }) => betweenSmallAndLarge`
          position: absolute;
          max-width: 100%;
          z-index: 1;
        
          transform: none;
          overflow: visible;

          > picture {
            overflow: visible;
          }

          &:first-child {
            > picture {
              position: absolute;
              width: 60%;
              top: 0;
              left: 0;
            }
          }

          &:not(:first-child) {
            > picture {
              > img {
                border-radius: 1rem;
                box-shadow: 1rem 0px 5rem 0.5rem ${transparentize(0.5, theme.black)};
              }
              position: absolute;
              width: 65%;
              height: 80%;
              top: 40%;
              left: 50%;
            }
          }
        `}
        
        ${fromLarge`
          position: relative;
          justify-content: center;
          width: 40%;
          transform: none;
          z-index: 5;
          :not(:first-child) {
            visibility: visible;
          }       
        `}
      }
    }

    > ${ProductLogoCollectionView} {
      filter: ${({ theme }) => theme.darkModeFilter};
      ${upToSmall`
        max-width: 100%;
      `}
      ${fromSmall`
        max-width: 50%;
      `}
      ${fromLarge`
        max-width: 35%;
      `}
    }
  }

`
