import { TFC } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { darken } from 'polished'

import { Column, Row } from 'components/Layout'
import { ProductPageProps } from './AsideWithVideo'
import { ExternalLink, TYPE } from 'theme'
import { Dribbble, Instagram } from 'react-feather'
import Button from 'components/Button'
import { SocialType } from 'mock/types'
import { DEFAULT_IK_TRANSFORMS, FIXED_IMAGE_SIZE_CONSTRAINTS, STORE_IMAGE_SIZES } from 'constants/config'
import { CarouselContainer, CarouselStep } from 'components/Carousel/styleds'
import { fromExtraLarge, fromLarge, upToSmall } from 'theme/utils'

const saturateAnimation = css`
  @keyframes saturate {
    0% {
      filter: contrast(1.8) saturate(20) blur(5px);
    }
    10% {
      filter: contrast(1.8) saturate(1) blur(0.8px);
    }
  }
`

const textShadowAnimation = css<{ itemColor: string }>`
  @keyframes textShadowAnimation {
    0% {
      text-shadow: 20px 2px 2px ${({ itemColor }) => itemColor};
      letter-spacing: 20px;
    }
    3% {
      text-shadow: 55px 2px 8px ${({ itemColor }) => itemColor};
    }
    5% {
      text-shadow: -22px 2px 2px pink;
    }
    7% {
      text-shadow: 47px 2px 8px ${({ itemColor }) => itemColor};
    }
    10% {
      text-shadow: 17px 2px 8px ${({ itemColor }) => itemColor};
    }
    47% {
      text-shadow: 10px 2px 2px ${({ itemColor }) => itemColor};
      letter-spacing: 7px;
    }
    48% {
      text-shadow: -20px 2px 1px pink;
    }
    49% {
      text-shadow: 20px 2px 2px ${({ itemColor }) => itemColor};
    }
    53% {
      text-shadow: 55px 2px 8px ${({ itemColor }) => itemColor};
    }
    55% {
      text-shadow: -32px 2px 2px purple;
    }
    57% {
      text-shadow: 47px 2px 7px lightgreen;
    }
    58% {
      text-shadow: -47px 2px 1px ${({ itemColor }) => itemColor};
    }
    60% {
      text-shadow: 20px 2px 2px ${({ itemColor }) => itemColor};
    }
    65% {
      text-shadow: 20px 2px 5px purple;
    }
  }
`

export const fadeInAnimation = css`
  @keyframes fadeIn {
    0% {
      filter: contrast(0) blur(100px);
    }
    100% {
      filter: contrast(1) blur(0px);
    }
  }
`

export const VideoContentWrapper = styled(Row)<{ hide?: boolean }>`
  z-index: -1;

  opacity: 1;
  ${({ hide }) => hide && `opacity: 0;`}
  transition: opacity 0.8s ease-in-out;

  video {
    // lock the video to 16:9 ratio
    // height: calc(100vw * (9 / 16));
    height: 100%;

    filter: contrast(1) saturate(1) blur(0px);

    ${saturateAnimation};

    animation-name: saturate;
    animation-duration: 10.4s;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      display: none;
    `}
  }
`
export const Strikethrough = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  height: 5px;
`
export type ItemHeaderProps = { animation?: boolean; animationDelay?: boolean; itemColor: string; maxWidth?: string }
export const ItemHeader = styled(TYPE.white)<ItemHeaderProps>`
  z-index: 100;
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

  ${({ animation = false }) => animation && textShadowAnimation}
  ${({ animation = false, animationDelay = true, itemColor }) =>
    animation &&
    `
      text-shadow: 10px 2px 2px ${itemColor};
      animation-name: textShadowAnimation;
      animation-duration: 10s;
      animation-iteration-count: 3;
      ${animationDelay && 'animation-delay: 1s;'}
    `}
`

export const ItemLogo = styled.div<{
  $bgColor?: string
  catalogView?: boolean
  $maxWidth?: string
  $marginTop?: string
}>`
  ${({ $bgColor }) => $bgColor && `background-color: ${$bgColor};`}
  z-index: 100;

  img {
    max-width: ${({ $maxWidth = '100%' }) => $maxWidth};
  }

  ${({ theme, $marginTop = '-35px' }) => theme.mediaWidth.upToSmall`
  margin-top: ${$marginTop};  
  `}
`

export const ItemLogoCssImport = styled(ItemLogo)<{ logoUri: string }>`
  position: fixed;
  background: ${({ logoUri }) =>
    `url(${logoUri}?tr=${DEFAULT_IK_TRANSFORMS.HQ_LOGO}) center, url(${logoUri}?tr=${DEFAULT_IK_TRANSFORMS.LQ_LOGO}) center no-repeat`};
  background-size: cover;
  height: 300px;
`

export const ItemLogoCatalogView = styled(ItemLogoCssImport)<{ $bgColor: string }>`
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
  z-index: 0;

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
    useGradient ? `linear-gradient(15deg, ${darken(0.06, bgColor)} 0%, ${bgColor} 70%)` : bgColor};
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
  fontSize: '1.8rem',
  padding: 0,
  fontWeight: 500,
  lineHeight: 1.2,
  ...props
}))`
  text-transform: uppercase;
  font-style: italic;

  .item-description-p:first-child {
    margin-top: 0;
  }
`

export const SubItemDescription = styled(ItemDescription).attrs(props => ({
  ...props,
  padding: '1.8rem',
  margin: '20px 0',
  backgroundColor: 'ghostwhite',
  fontWeight: 400
}))`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`

export const ItemContentContainer = styled(Column)``

// CATALOG NON-CAROUSEL VIEW vs NON-CATALOG CAROUSEL ACTIVE VIEW
// w/carousel
export const InnerContainer = styled(Column)<{ bgColor?: string }>``
// w.o carousel (catalog)
export const InnerCatalogContainer = styled(Column)<{ bgColor?: string }>``

export const ItemAsidePanel = styled(Column)`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
`

export const ItemContainer = styled(Row)<{ side?: 'LEFT' | 'RIGHT'; catalogView?: boolean; bgColor?: string }>`
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
    > ${InnerCatalogContainer}, > ${InnerContainer} {
      position: relative;
      background: ${({ theme, bgColor = theme.white }) => `linear-gradient(${bgColor} 30%, ${theme.white} 55%)`};
      box-shadow: 10px 0px 50px 5px black;
      
      width: 100%;
    }

    //  *
    //  * INNER CATALOG CONTAINER WITHOUT CAROUSEL
    //  * 
    > ${InnerCatalogContainer} {
      > ${ItemLogo} {
        margin-top: 0px;
      }
      // MEDIA QUERIES --> SMALL and below
      ${({ theme }) => theme.mediaWidth.upToSmall`
        padding: 15px;
      `}
      // MEDIA QUERIES --> LARGE and below
      ${({ theme }) => theme.mediaWidth.upToLarge`
        height: 100%;
        max-width: 100%;
      `}
      // MEDIA QUERIES --> LARGE and up
      ${({ theme }) => theme.fromMediaWidth.fromLarge`
        width: 100%;
        max-width: unset;
        overflow: hidden;
      `}

      // ----------------------- //
      // CAROUSEL CONTAINER 
      // ----------------------- //
      > ${CarouselContainer} {
        > ${CarouselStep} {
          height: 100%;

          img {
            max-width: unset;
            height: 100%;
          }
        }

        ${({ theme }) => theme.mediaWidth.upToSmall`
          margin-top: 50px;
          > ${CarouselStep} {
            width: auto;
            justify-content: center;            
          }
        `}
        // MEDIA QUERIES --> SMALL and above
        ${({ theme }) => theme.fromMediaWidth.fromSmall`
          > ${CarouselStep} {
            max-width: 80%;
            z-index: 1;
          
            &:not(:first-child) {
              transform: none;
              z-index: 0;
            }
          }
        `}

        ${({ theme }) => theme.fromMediaWidth.fromMedium`
          > ${CarouselStep} {
            justify-content: flex-start;            
          }
        `}

        ${({ theme }) => theme.fromMediaWidth.fromLarge`
          > ${CarouselStep} {
            justify-content: center;            
          }
        `}

        // MEDIA QUERIES --> LARGE and up
        ${({ theme }) => theme.fromMediaWidth.fromLarge`  
          justify-content: space-between;
          overflow: visible;

          > ${CarouselStep} {
            position: relative;
            width: 40%;
            transform: none;
            z-index: 5;
          }
        `}
      }

      // ----------------------- //
      // ITEM CATALOG LOGO
      // ----------------------- //
      > ${ItemLogoCatalogView} {
        // MEDIA QUERIES --> SMALL and below
        ${({ theme }) => theme.mediaWidth.upToSmall`
          max-width: 100%;
        `}
        // MEDIA QUERIES --> LARGE and below
        ${({ theme }) => theme.fromMediaWidth.fromSmall`
          max-width: 50%;
        `}
        // MEDIA QUERIES --> LARGE and below
        ${({ theme }) => theme.fromMediaWidth.fromLarge`
          max-width: 35%;
        `}
      }
    }

    //  *
    //  * INNER CONTAINER WITH CAROUSEL
    //  *
    > ${InnerContainer} {
      max-width: ${STORE_IMAGE_SIZES.SMALL}px;

      // MEDIA QUERIES --> SMALL and below
      ${upToSmall`
        max-width: 100%;

        > ${ItemContentContainer} {
          padding-left: 0;
          padding-right: 0;
        }
      `}
      
      // MEDIA QUERIES --> LARGE and up
      ${({ theme, bgColor = theme.white }) => fromLarge`
        max-width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromLarge};
        background: linear-gradient(${bgColor} 35%, ${theme.white} 60%);
      `}

      // MEDIA QUERIES --> X-LARGE and up
      ${({ theme, bgColor = theme.white }) => fromExtraLarge`
        max-width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromExtraLarge};
        background: linear-gradient(${bgColor} 55%, ${theme.white} 80%);
      `}

      > ${ItemLogo} {
        width: 100%;
        margin-top: -75px;

        > img {
          margin: 0 0 -21px 0;
        }

        ${fromLarge`
          width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromLarge};
        `}
        ${fromExtraLarge`
          width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromExtraLarge};
        `}
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

export const ItemCredits: TFC = ({ children }) => (
  <TYPE.black fontSize={'1.4rem'} padding="13px 8px" fontWeight={300} width="100%">
    {children}
  </TYPE.black>
)

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

  z-index: -1;
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
  border-radius: 0 0 0 10px;
  z-index: 950;

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
  font-size: 4rem;
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
  padding: 5px 10px;
  line-height: 1.8;
`
