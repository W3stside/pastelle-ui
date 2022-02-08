import { TFC } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { transparentize } from 'polished'

import { Column, Row } from 'components/Layout'
import { ItemPageProps, SocialType } from './AsideWithVideo'
import { ExternalLink, TYPE } from 'theme'
import { Dribbble, Instagram } from 'react-feather'

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

export const VideoContentWrapper = styled(Row)`
  z-index: -1;

  video {
    // lock the video to 16:9 ratio
    // height: calc(100vw * (9 / 16));
    height: 100%;

    filter: contrast(1.8) saturate(1) blur(0.5px);

    ${saturateAnimation}

    animation-name: saturate;
    animation-duration: 10.4s;
  }
`
export const Strikethrough = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  height: 5px;
`
export type ItemHeaderProps = { animation?: boolean; itemColor: string }
export const ItemHeader = styled(TYPE.largeHeader)<ItemHeaderProps>`
  z-index: 100;
  font-style: italic;
  letter-spacing: 7px;

  ${({ animation = false }) => animation && textShadowAnimation}
  ${({ animation = false, itemColor }) =>
    animation &&
    `
      text-shadow: 10px 2px 2px ${itemColor};
      animation-name: textShadowAnimation;
      animation-duration: 10s;
      animation-iteration-count: 3;
      animation-delay: 1s;
    `}
`

export const ItemSubHeader = styled(TYPE.black).attrs(() => ({
  fontSize: 16,
  padding: 2,
  fontWeight: 300,
  fontStyle: 'italic'
}))<{ bgColor?: string }>`
  background: ${({ bgColor = 'transparent' }) =>
    `linear-gradient(15deg, ${bgColor} 0%, ${transparentize(1, bgColor)} 35%, transparent 70%)`};
  width: 100%;
`

export const ItemBreadcrumb = styled(NavLink)`
  color: ${({ theme }) => theme.black};
  font-size: 10px;
  font-weight: 300;
  text-decoration: none;
  text-transform: uppercase;

  > span:first-child {
    margin: 0 5px;
  }
`

export const ItemAsidePanel = styled(Column)`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  // padding: 5px;
`

export const ItemContainer = styled(Row)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: stretch;

  position: relative;

  > ${ItemAsidePanel} {
    position: relative;
    justify-content: flex-start;

    margin: 10px auto 10px 10px;
    border: 2px solid transparent;
    
    height: 100%;
    width: 100%;
    max-width: 500px;

    overflow-x: hidden;
    z-index: 2;

    background: ${({ theme }) => transparentize(0.1, theme.white)};
    // background: ${({ theme }) => transparentize(0.1, theme.red2)};
  }

  > ${VideoContentWrapper} {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  select {
    min-width: 15ch;
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
  <TYPE.black fontSize={14} padding="13px 8px" fontWeight={300} width="100%">
    {children}
  </TYPE.black>
)

function _showSocialUrl(type: SocialType) {
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

export const ItemArtistInfo = (props: ItemPageProps['itemArtistInfo'] | undefined) => {
  if (!props) return null

  const { artist, social } = props

  return (
    <TYPE.black fontSize={14} padding={2} fontWeight={300}>
      <ItalicStrikethrough>PASTELLE</ItalicStrikethrough> x {artist}
      <br />
      <br />
      {social.map(({ type, url, display }) => (
        <ExternalLink
          key={url}
          href={url}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 5 }}
        >
          {_showSocialUrl(type)} {display}
        </ExternalLink>
      ))}
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

const FloatingColouredBlock = styled.div<{ color: string }>`
  height: 100%;
  width: 100%;
  background: ${({ color }) => color};
`

export const FloatingStrip = ({ color, ...rest }: FloatingColoredBlock & { color: string }) => (
  <FloatingBlockContainer {...rest}>
    <FloatingColouredBlock color={color} />
  </FloatingBlockContainer>
)

export const BreadcrumbWrapper = styled(ItemSubHeader)`
  display: flex;
  gap: 5px;
  margin-bottom: -24px;
  z-index: 100;
  padding-top: 4px;
  font-size: 12px;
`

export const PASTELLE_CREDIT = (
  <>
    Homegrown at <ItalicStrikethrough>PASTELLE</ItalicStrikethrough> labs
  </>
)
