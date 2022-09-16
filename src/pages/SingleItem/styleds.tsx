import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { darken, transparentize } from 'polished'

import { Column, Row } from 'components/Layout'
import { ProductPageProps } from './AsideWithVideo'
import { ExternalLink, TYPE } from 'theme'
import { Dribbble, Instagram } from 'react-feather'
import Button from 'components/Button'
import { SocialType } from 'mock/types'
import { FIXED_IMAGE_SIZE_CONSTRAINTS, STORE_IMAGE_SIZES, Z_INDEXES } from 'constants/config'
import { CarouselContainer, CarouselStep } from 'components/Carousel/styleds'
import {
  fromExtraLarge,
  fromLarge,
  fromMedium,
  fromSmall,
  OFF_WHITE,
  setCssBackground,
  upToLarge,
  upToSmall
} from 'theme/utils'
import { setAnimation, textShadowAnimation } from 'theme/styles/animations'

export const VideoContentWrapper = styled(Row)<{ hide?: boolean; zIndex?: number }>`
  z-index: ${({ zIndex = 1 }) => zIndex};

  opacity: 1;
  ${({ hide }) => hide && `opacity: 0;`}
  transition: opacity 0.8s ease-in-out;

  video {
    // lock the video to 16:9 ratio
    // height: calc(100vw * (9 / 16));
    height: ${({ height = '100%' }) => height};
    ${({ width }) => width && `width: ${width};`}
  }
`
export const Strikethrough = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  height: 5px;
`
export type ItemHeaderProps = { animation?: boolean; animationDelay?: boolean; itemColor: string; maxWidth?: string }
export const ItemHeader = styled(TYPE.white)<ItemHeaderProps>`
  z-index: ${Z_INDEXES.PRODUCT_CONTENT};
  font-style: italic;
  letter-spacing: 7px;
  font-size: 10rem;

  // logo
  > img {
    max-width: ${({ maxWidth = '100%' }) => maxWidth};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 6.5rem;
  `}

  ${({ animation, animationDelay, itemColor }) =>
    setAnimation(
      textShadowAnimation,
      {
        state: animation,
        name: 'textShadowAnimation',
        delay: animationDelay ? 1 : undefined,
        count: 3,
        duration: 10
      },
      css`
        text-shadow: 1rem 0.2rem 0.2rem ${itemColor};
      `
    )}
`

export const ItemLogo = styled.div<{
  $bgColor?: string
  collectionView?: boolean
  $maxWidth?: string
  $marginTop?: string
}>`
  display: flex;
  ${({ $bgColor }) => $bgColor && `background-color: ${$bgColor};`}
  z-index: ${Z_INDEXES.PRODUCT_CONTENT};

  img {
    width: 100%;
    max-width: ${({ $maxWidth = '100%' }) => $maxWidth};
  }

  ${({ theme, $marginTop = '-35px' }) => theme.mediaWidth.upToSmall`
    margin-top: ${$marginTop};  
  `}
`
/* 
background: ${({ logoUri }) =>
    `url(${logoUri}?tr=${DEFAULT_IK_TRANSFORMS.HQ_LOGO}) center, url(${logoUri}?tr=${DEFAULT_IK_TRANSFORMS.LQ_LOGO}) center no-repeat`};
*/
export const ItemLogoCssImport = styled(ItemLogo)<{ position?: string; height?: number; logoUri: string }>`
  position: ${({ position = 'fixed' }) => position};
  ${({ theme, logoUri }) =>
    setCssBackground(theme, {
      isLogo: true,
      imageUrls: [logoUri, logoUri],
      backgroundAttributes: ['center/cover', 'center/cover no-repeat']
    })}
    
  height: ${({ height = 160 }) => height}px;
`

export const ItemLogoCollectionView = styled(ItemLogoCssImport)<{ $bgColor: string }>`
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-size: contain;
  background-blend-mode: difference;
  background-color: ${({ $bgColor }) => $bgColor};
  /* animation-name: flickerIn;
  animation-duration: 4s;
  animation-iteration-count: 2;
  animation-delay: 3s; */
  height: auto;
  max-width: 30%;
  z-index: ${Z_INDEXES.ZERO};

  // MEDIA QUERIES --> SMALL and below
  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: absolute;
    max-width: 100%;
    height: 100%;
    // z-index: 1;
  `}

  // MEDIA QUERIES --> LARGE and below
  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0 0 0 auto;
  `}
`

export const ItemSubHeader = styled(TYPE.black).attrs(props => ({
  fontSize: '1.8rem',
  padding: 2,
  margin: '2rem 0',
  fontWeight: 500,
  fontStyle: 'italic',
  ...props
}))<{ bgColor?: string; useGradient?: boolean; label?: string }>`
  background: ${({ useGradient = false, bgColor = 'transparent' }) =>
    useGradient ? `linear-gradient(15deg, ${bgColor} 0%, ${darken(0.1, bgColor)} 80%)` : bgColor};
  width: 100%;

  ${({ theme, label }) =>
    label &&
    `
    &:before {
      content: "${label}";
      color: ${theme.white};
      padding: 0 1rem;
    }
    // for repeating header effect
    display: flex;
    justify-content: flex-end;
    overflow: hidden;
    white-space: break-word;
    gap: 7px;
  `}
`

export const ItemBreadcrumb = styled(NavLink)`
  color: ${({ theme }) => theme.black};
  font-size: 1rem;
  font-weight: 300;
  text-decoration: none;
  text-transform: uppercase;

  > span:first-child {
    margin: 0 5px;
  }
`
export const ItemDescription = styled(TYPE.black).attrs(props => ({
  fontSize: props.fontSize || '1.8rem',
  padding: props.padding || 0,
  fontWeight: props.fontWeight || 500,
  lineHeight: props.lineHeight || 1.2,
  ...props
}))`
  text-transform: uppercase;
  font-style: italic;

  .item-description-p:first-child {
    margin-top: 0;
  }
  border-radius: 1rem;
`

export const SubItemDescription = styled(ItemDescription).attrs(props => ({
  ...props,
  padding: props.padding || '1.8rem',
  margin: props.margin || '2rem 0',
  backgroundColor: props.backgroundColor || OFF_WHITE,
  fontWeight: props.fontWeight || 400
}))`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`

export const ItemContentContainer = styled(Column)``

// COLLECTION NON-CAROUSEL VIEW vs NON-COLLECTION CAROUSEL ACTIVE VIEW
// w/carousel
export const InnerContainer = styled(Column)<{ bgColor?: string }>``
// w.o carousel (collection)
export const InnerCollectionContainer = styled(Column)<{ bgColor?: string }>``

export const ItemAsidePanel = styled(Column)`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
`

export const ItemContainer = styled(Row)<{ side?: 'LEFT' | 'RIGHT'; collectionView?: boolean; bgColor?: string }>`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: stretch;

  position: relative;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: stretch;
  `}

  > ${ItemAsidePanel} {
    overflow-y: auto;
    position: relative;
    justify-content: ${({ side = 'LEFT' }) => (side === 'LEFT' ? 'flex-start' : 'flex-end')};
    
    height: 100%;
    width: 100%;

    z-index: 2;

    // MEDIA QUERIES --> SMALL and below
    ${({ theme }) => theme.mediaWidth.upToSmall`
      border: none;
      margin: 0;
    `}

    //  *
    //  * BOTH INNER CONTAINERS
    //  *
    > ${InnerCollectionContainer}, > ${InnerContainer} {
      position: relative;
      
      width: 100%;
    }

    //  *
    //  * COLLECTION INNER CONTAINER WITHOUT CAROUSEL
    //  * 
    > ${InnerCollectionContainer} {
      // MEDIA QUERY --> SMALL and below
      ${upToSmall`
        padding: 15px;
      `}
      // MEDIA QUERY --> LARGE and below
      ${upToLarge`
        height: 100%;
        max-width: 100%;
      `}
      // MEDIA QUERY --> LARGE and up
      ${fromLarge`
        overflow: hidden;
        width: 100%;
        max-width: unset;
      `}

      // ----------------------- //
      // COLLECTION ITEM LOGO
      // ----------------------- //
      > ${ItemLogo} {
        margin-top: 0px;
      }

      // ----------------------- //
      // COLLECTION CAROUSEL CONTAINER 
      // ----------------------- //
      > ${CarouselContainer} {
        // MEDIA QUERY --> SMALL and below
        ${upToSmall`
          margin-top: 50px;
        `}
        // MEDIA QUERY --> LARGE and up
        ${fromLarge`  
          justify-content: space-between;
          overflow: visible;
        `}

        > ${CarouselStep} {
          position: relative;
          height: 100%;
          
          > picture{
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
            }
          }

          &:last-child {
            box-shadow: 1rem 0px 5rem 0.5rem ${({ theme }) => transparentize(0.5, theme.black)};

            > picture {
              border-radius: 0 1rem 1rem 0;
            }
          }

          // MEDIA QUERY --> SMALL and below
          ${upToSmall`
            width: auto;
            justify-content: center;            
            :not(:first-child) {
              position: absolute;
            }
          `}
          // MEDIA QUERY --> SMALL and above
          ${fromSmall`
            max-width: 100%;
            z-index: 1;
          
            :not(:first-child) {
              visibility: hidden;
              transform: none;
              z-index: ${Z_INDEXES.ZERO};
            }
          `}
          // MEDIA QUERY --> MEDIUM and above
          ${fromMedium`
            position: absolute;
            justify-content: flex-start;       
          `}
          // MEDIA QUERY --> LARGE and above
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

      // ----------------------- //
      // ITEM COLLECTION LOGO
      // ----------------------- //
      > ${ItemLogoCollectionView} {
        // MEDIA QUERY --> SMALL and below
        ${upToSmall`
          max-width: 100%;
        `}
        // MEDIA QUERY --> SMALL and above
        ${fromSmall`
          max-width: 50%;
        `}
        // MEDIA QUERY --> LARGE and above
        ${fromLarge`
          max-width: 35%;
        `}
      }
    }

    //  *
    //  * INNER CONTAINER WITH CAROUSEL
    //  *
    > ${InnerContainer} {
      background: ${({ theme, bgColor = theme.white }) => `linear-gradient(${bgColor} 30%, ${theme.white} 55%)`};
      max-width: ${STORE_IMAGE_SIZES.SMALL}px;
      box-shadow: 1rem 0px 5rem 0.5rem ${({ theme }) => transparentize(0.5, theme.black)};

      // MEDIA QUERIES --> SMALL and below
      ${upToSmall`
        max-width: 100%;
        overflow-x: clip;
        
        > ${ItemContentContainer} {
          padding-left: 0;
          padding-right: 0;
        }
      `}
      // MEDIA QUERIES --> LARGE and up
      ${({ theme, bgColor = theme.white }) => fromLarge`
        max-width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromLarge};
        background: linear-gradient(${bgColor} 35%, ${theme.white} 60%);
      `} d
      // MEDIA QUERIES --> X-LARGE and up
      ${({ theme, bgColor = theme.white }) => fromExtraLarge`
        max-width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromExtraLarge};
        background: linear-gradient(${bgColor} 55%, ${theme.white} 80%);
      `}

      > ${ItemLogo} {
        width: 100%;
        margin-top: -14.9%;        

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

      > ${CarouselContainer} {
        > ${CarouselStep} {
          height: 100%;

          img {
            max-width: unset;
            height: 100%;
          }
        }
      }
    }
  }

  > ${VideoContentWrapper} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  select {
    text-align: center;
    min-width: 50px;
    max-width: 100%;
    border: 1px solid var(--select-border);
    border-radius: 0.25em;
    padding: 0.25em 0.5em;
    margin: 0 5px;
    font-size: 1.25rem;
    cursor: pointer;
    line-height: 1.1;
    background-color: #fff;
    background-image: linear-gradient(to top, #f9f9f9, #fff 33%);

    display: grid;
    grid-template-areas: 'select';
    align-items: center;

    &:after {
      content: '';
      width: 0.8em;
      height: 0.5em;
      background-color: #777;
      clip-path: polygon(100% 0%, 0 0%, 50% 100%);

      justify-self: end;
    }

    select,
    .select:after {
      grid-area: select;
    }
  }
`

export const ItalicStrikethrough = styled.i`
  text-decoration: line-through;
`

export const ItemCredits = styled(TYPE.black).attrs(props => ({
  ...props,
  fontSize: '1.4rem',
  padding: '1.3rem 0.8rem',
  fontWeight: 300,
  width: '100%'
}))``

function _showSocialUrl(type: string | SocialType) {
  switch (type) {
    case SocialType.INSTAGRAM:
      return <Instagram />
    case SocialType.DEVIANTART:
      return <Instagram />
    case SocialType.DRIBBBLE:
      return <Dribbble />
    case SocialType.TIKTOK:
      return <Instagram />
    case SocialType.BEHANCE:
      return <Instagram />
    default:
      return null
  }
}

export const ItemArtistInfo = (props: (ProductPageProps['artistInfo'] & { bgColor: string }) | undefined) => {
  if (!props) return null

  const { name, type, url, display, bgColor } = props

  return (
    <TYPE.black fontSize={'1.8rem'} padding={2} fontWeight={300}>
      <HighlightedText bgColor={bgColor}>
        <ItalicStrikethrough>PASTELLE</ItalicStrikethrough> x {name}
      </HighlightedText>
      <br />
      <br />
      <ExternalLink
        key={url}
        href={url}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 5 }}
      >
        {_showSocialUrl(type)} {display}
      </ExternalLink>
    </TYPE.black>
  )
}
type FloatingColoredBlock = {
  width?: number
  height?: number
  top?: number
  left?: number
  gradientBase?: string
  gradientEnd?: string
  rotation?: number
}

export const FloatingBlockContainer = styled.div<FloatingColoredBlock>`
  position: absolute;
  background-image: ${({ gradientBase = 'rgba(33, 114, 229, 0.1)', gradientEnd = 'rgba(33, 36, 41, 1)' }) =>
    `radial-gradient(50% 50% at 50% 50%, ${gradientBase} 0%, ${gradientEnd} 100%)`};

  transform: rotate(${({ rotation = 45 }) => rotation}deg);

  width: ${({ width = 755 }) => width}px;
  height: ${({ height = 292 }) => height}px;
  top: ${({ top = 57 }) => top}px;
  left: ${({ left = -106 }) => left}px;

  z-index: ${Z_INDEXES.BEHIND};
`

export const PASTELLE_CREDIT = (
  <>
    Homegrown at <ItalicStrikethrough>PASTELLE</ItalicStrikethrough> labs
  </>
)

export const VideoControlButton = styled(Button)`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  padding: 10;
  border-radius: 0 0 0 1rem;
  z-index: ${Z_INDEXES.SCROLLER_DIV + 50};

  > ${ItemSubHeader} {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
    gap: 5px;
    color: ${({ theme }) => theme.black};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
      display: none;
  `}
`

export const MobileItemCTA = styled(Row)`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  height: auto;
  text-align: center;
  background-color: lavender;
  font-size: 3rem;
  font-weight: 100;
  width: calc(100% - 600px);
  color: #000;
  letter-spacing: -3.5;

  ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100%;
      display: block;
  `}
`

export const HighlightedText = styled.span<{ color?: string; bgColor: string }>`
  color: ${({ theme, color = theme.white }) => color};
  background-color: ${({ bgColor }) => darken(0.3, bgColor)};
  padding: 0.5rem 1rem;
  line-height: 1.8;
`
