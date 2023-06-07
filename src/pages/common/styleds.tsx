import { Button, Column, Row } from '@past3lle/components'
import { ExternalLink } from '@past3lle/components'
import {
  BLACK,
  rotateKeyframe,
  setAnimation,
  setBackgroundWithDPI,
  setBestTextColour,
  textShadowAnimation,
  upToSmallHeight,
} from '@past3lle/theme'
import { Text } from 'components/Text'
import { Z_INDEXES } from 'constants/config'
import { SocialType } from 'mock/types'
import { BaseProductPageProps } from 'pages/common/types'
import { darken } from 'polished'
import { Dribbble, Instagram } from 'react-feather'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { ThemeModes } from 'theme'
import { ShopImageSrcSet } from 'types'

export const ScrollingProductLabel = styled(Row).attrs((props) => ({ padding: '1rem', ...props }))<{
  logo?: ShopImageSrcSet
  labelColor?: string
}>`
  position: absolute;
  top: 0;
  width: 100%;
  margin: auto;
  z-index: ${Z_INDEXES.SCROLLER_DIV + 50};
  gap: 1rem;
  font-size: 2rem;
  font-variation-settings: 'wght' 300;
  text-shadow: 0px 0 0.5rem ${({ labelColor }) => labelColor || BLACK};

  > ${Row} {
    > strong {
      &:first-child {
        font-variation-settings: 'wght' 600;
      }
      &:nth-child(2) {
        font-variation-settings: 'wght' 400;
      }
    }
  }

  ${({ theme, logo }) =>
    setBackgroundWithDPI(theme, logo, {
      dpiLevel: '1x',
      backgroundColor: BLACK,
      backgroundAttributes: ['center / cover no-repeat', '-8px / cover repeat'],
      backgroundBlendMode: 'difference',
      lqIkUrlOptions: {
        transforms: ['pr-true,q-30', 'pr-true,q-10,bl-12'],
      },
    })}

  ${upToSmallHeight`
      > ${Row}:nth-child(2) {
        display: none;
      }
    `}
`

export const VideoContentWrapper = styled(Row)<{ hide?: boolean; zIndex?: number }>`
  z-index: ${({ zIndex = 1 }) => zIndex};

  opacity: 1;
  ${({ hide }) => hide && `opacity: 0;`}
  transition: opacity 0.8s ease-in-out;

  video {
    // lock the video to 16:9 ratio
    height: ${({ height = '100%' }) => height};
    ${({ width }) => width && `width: ${width};`}

    height: 100%;
  }
`
export const Strikethrough = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  height: 5px;
`
export type ItemHeaderProps = { animation?: boolean; animationDelay?: boolean; itemColor: string; maxWidth?: string }
export const ItemHeader = styled(Text.Header)<ItemHeaderProps>`
  z-index: ${Z_INDEXES.PRODUCT_CONTENT};
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
        duration: 10,
      },
      css`
        text-shadow: 1rem 0.2rem 0.2rem ${itemColor};
      `
    )}
`

export const ProductLogo = styled.div<{
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
export const ProductLogoCssImport = styled(ProductLogo)<{
  position?: string
  height?: number
  logoUri: ShopImageSrcSet
}>`
  position: ${({ position = 'fixed' }) => position};
  ${({ theme, logoUri }) =>
    setBackgroundWithDPI(theme, [logoUri, logoUri], {
      preset: 'logo',
      backgroundAttributes: ['center/cover no-repeat', 'center/cover repeat'],
      lqIkUrlOptions: {
        transforms: [null, 'pr-true,q-60,bl-12'],
      },
    })}

  height: ${({ height = 160 }) => height}px;
`

export const ProductLogoCollectionView = styled(ProductLogoCssImport)<{ $bgColor: string }>`
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;

  background-size: contain;
  background-blend-mode: difference;
  background-color: ${({ $bgColor }) => $bgColor};

  height: auto;
  max-width: 30%;
  z-index: ${Z_INDEXES.ZERO};

  // MEDIA QUERIES --> SMALL and below
  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: absolute;
    max-width: 100%;
    height: 100%;
    background: none;
    // z-index: 1;
  `}

  // MEDIA QUERIES --> LARGE and below
  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0 0 0 auto;
  `}
`

export const ProductSubHeader = styled(Text.SubHeader)<{
  color?: string
  bgColor?: string
  useGradient?: boolean
  label?: string | boolean
}>`
  color: ${({ theme }) => theme.content.text};
  background: ${({ theme: { mode }, useGradient = false, bgColor = 'transparent' }) =>
    useGradient
      ? `linear-gradient(15deg, ${mode === ThemeModes.DARK ? darken(0.1, bgColor) : bgColor} 0%, ${
          mode === ThemeModes.DARK ? BLACK : darken(0.1, bgColor)
        } 80%)`
      : bgColor};
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

export const ItemBreadcrumb = styled(NavLink)<{ color: string }>`
  color: ${({ color }) => setBestTextColour(color)};
  font-size: 1.4rem;
  font-weight: 300;
  text-decoration: none;
  text-transform: uppercase;

  > span:first-of-type {
    margin: 0 5px;
  }
`
export const ProductDescription = styled(Text.Black).attrs((props) => ({
  fontSize: props.fontSize || '1.8rem',
  padding: props.padding || 0,
  fontWeight: props.fontWeight || 500,
  lineHeight: props.lineHeight || 1.2,
  backgroundColor: props.theme.content.background,
  color: props.theme.content.text,
  ...props,
}))`
  text-transform: uppercase;
  font-style: italic;

  .item-description-p:first-of-type {
    margin-top: 0;
  }

  border-radius: ${({ theme: { button } }) => button.border.radius};
`

export const ProductBackendDescription = styled(ProductDescription)<{ accentColor: string }>`
  blockquote {
    margin: 0;
  }

  h1,
  h2,
  h3,
  h4 {
    text-decoration: ${({ accentColor }) => `underline 0.3rem solid ${accentColor}`};
    &:not(h1) {
      margin-bottom: 1rem;
    }
  }
  ul,
  ol {
    list-style: tibetan;
    margin-top: 0;
  }
`

export const ProductSubDescription = styled(ProductDescription).attrs((props) => ({
  ...props,
  padding: props.padding || '1.8rem',
  margin: props.margin || '2rem 0',
  color: props.theme.content.text,
  backgroundColor: props.theme.content.textAlt,
  fontWeight: props.fontWeight || 400,
}))`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`

export const ProductScreen = styled(Column)`
  position: relative;
  overflow: hidden;

  > ${Column} {
    padding: 0 2rem;
  }
`

export const ProductAsidePanel = styled(Column)`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
`

export const ProductScreensContainer = styled(Column)`
  position: relative;
  width: 100%;
`

export const ProductContainer = styled(Row)<{
  side?: 'LEFT' | 'RIGHT'
  bgColor?: string
  navLogo?: ShopImageSrcSet
  logo?: ShopImageSrcSet
}>`
  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: stretch;

  position: relative;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: stretch;
  `}

  > ${VideoContentWrapper} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  > ${ProductAsidePanel} {
    overflow-y: auto;
    position: relative;
    justify-content: ${({ side = 'LEFT' }) => (side === 'LEFT' ? 'flex-start' : 'flex-end')};
    
    height: 100%;
    width: 100%;

    z-index: 2;

    // MEDIA QUERIES --> SMALL and below
    ${({ theme }) => theme.mediaWidth.upToSmall`
    // corresponds with > CollectionScreensContainer
    // ios does NOT support overflow-x: clip; so we need this
      @supports not (overflow:clip) {
        position: fixed;
        left: 0;
        right: 0;

        overflow-x: hidden;
      }
      border: none;
      margin: 0;
    `}
  
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
    background-color: ${({ theme }) => theme.content.background};

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

export const ProductCredits = styled(Text.Black).attrs((props) => ({
  ...props,
  fontSize: '1.4rem',
  padding: '1.3rem 0.8rem',
  fontWeight: 300,
  width: '100%',
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

export const ProductArtistInfo = (props: (BaseProductPageProps['artistInfo'] & { bgColor: string }) | undefined) => {
  if (!props) return null

  const { name, type, url, display, bgColor } = props

  return (
    <Text.Black fontSize={'1.8rem'} padding={2} fontWeight={300}>
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
    </Text.Black>
  )
}

export const PASTELLE_CREDIT = (
  <>
    Homegrown at <ItalicStrikethrough>PASTELLE</ItalicStrikethrough> labs
  </>
)
// radial-gradient(76.02% 105.41% at 31.84% 0%,#7b649f 0%,#000000 100%)
// background: ${({ bgColor }) => `radial-gradient(76.02% 75.41% at 1.84% 0%, ${bgColor} 0%, #000000 100%)`};
export const VideoPlayCTAOverlay = styled(Row).attrs((props) => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  ...props,
}))<{
  bgColor?: string
  $width?: string | number
  $height?: string | number
}>`
  position: absolute;
  cursor: pointer;
  background: ${({ theme, bgColor }) =>
    `radial-gradient(76.02% 105.41% at 31.84% 0%,${bgColor} 0%,${theme.blackOpaque} 100%)`};
  ${({ $width }) => $width && `width: ${$width};`}
  ${({ $height }) => $height && `height: ${$height};`}
  z-index: ${Z_INDEXES.PRODUCT_VIDEOS};

  > img {
    width: 20%;
    margin: auto 20% auto auto;

    animation: ${rotateKeyframe} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  }
`

export const VideoControlButton = styled(Button).attrs({ borderRadius: '0' })`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  padding: 0.2rem;
  min-width: 14rem;
  border-radius: 0 0 0 1rem;
  z-index: ${Z_INDEXES.SCROLLER_DIV + 50};

  > ${ProductSubHeader} {
    margin: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: ${({ theme }) => theme.offwhite};
    margin: 0 2rem;
    width: auto;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
      display: none;
  `}
`

export const MobileItemCTA = styled(Row)`
  display: none;
  position: fixed;
  bottom: 0;
  right: 0;
  height: auto;
  text-align: center;
  background-color: lavender;
  font-size: 3rem;
  font-weight: 100;
  width: calc(100% - 600px);
  color: #000;
  letter-spacing: -3.5;

  z-index: ${Z_INDEXES.PRODUCT_VIDEOS};

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

export const FreeShippingBanner = styled(ProductDescription).attrs((props) => ({ ...props, padding: '1.8rem' }))`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  > svg {
    stroke: ${({ theme }) => theme.content.text};
  }
`
