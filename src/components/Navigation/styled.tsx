import { Button, Column, Row } from '@past3lle/components'
import { BLACK, setAnimation, setBackgroundWithDPI, setBestTextColour, upToMedium, upToSmall } from '@past3lle/theme'
import { TRANSPARENT_HEX, Z_INDEXES } from '@/constants/config'
import { darken } from 'polished'
import styled from 'styled-components/macro'
import { BLACK_TRANSPARENT_MORE, ThemeModes, getThemeColours } from '@/theme'
import { simmerAnimationCallback } from '@/theme/animation'
import { ShopImageSrcSet } from '@/types'

import { MobileNavProps } from '.'
import { BaseProductPageProps } from '../PagesComponents/types'

export const NavigationStepsWrapper = styled.nav<{
  isOpen?: boolean
  width?: string
  minWidth?: string
  currentMedia: { navLogoSet?: ShopImageSrcSet; color?: BaseProductPageProps['color']; fallbackColor?: string }
}>`
  position: relative;
  overflow: hidden;
  width: ${({ width = 'auto' }) => width};
  ${({ minWidth }) => minWidth && `min-width: ${minWidth};`}
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: start;
  text-align: left;
  gap: 0px;

  ${({ theme, currentMedia: { navLogoSet, fallbackColor, color } }) =>
    navLogoSet
      ? setBackgroundWithDPI(theme, navLogoSet, {
          preset: 'navbar',
          modeColours: [color || BLACK, BLACK],
        })
      : `background: ${fallbackColor || BLACK_TRANSPARENT_MORE};`}

  z-index: 1;

  > a {
    font-size: 1.6rem;
  }

  z-index: ${Z_INDEXES.NAV_MENU};

  ${({ theme: { mode }, currentMedia: { navLogoSet, color } }) =>
    !!navLogoSet &&
    setAnimation(simmerAnimationCallback(darken(mode === ThemeModes.DARK ? 0.4 : 0, color || BLACK)), {
      name: 'simmer' as Parameters<typeof setAnimation>[1]['name'],
      state: true,
      duration: 20,
      count: 5,
    })}

  ${({ isOpen, theme }) => upToMedium`
    display: ${isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 0; left: 0; bottom: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    
    > div.theme-toggler {
      min-height: 60px;
      width: 100%;
      padding: 1.25rem 0.75rem 1.25rem 1.25rem;
      background-color: ${theme.blackLight};
      border-radius: 0 1rem 1rem 0;
      > div {
        width: 13rem;
        margin: auto 0 auto auto;
      } 
    }

    // theme toggler
    // TODO: change when you don't want CSS BGs for logos (e.g use component)
    > ${InnerNavWrapper} {
      margin-top: auto;
    }
    
    width: ${isOpen ? '100%' : '0px'};
    opacity: ${isOpen ? '1' : '0'};
  `}
`

export const MobileNavOrb = styled(Button).attrs<MobileNavProps & { mobileHide?: boolean }>((props) => ({
  display: props.mobileHide ? 'none' : 'initial',
}))<MobileNavProps & { mobileHide?: boolean }>`
  display: none;
  background: ${({ theme, bgColor }) => bgColor || theme.red2};
  color: ${({ theme }) => theme.white};
  cursor: pointer;
  z-index: ${Z_INDEXES.NAV_MENU + 1};
  gap: 5px;

  padding-right: 0;

  > div {
    display: flex;
    padding: 1rem;
    background: #000;

    border-radius: ${({ theme }) => theme.button.border.radius};

    > svg {
      &:hover {
        transform: rotateZ(180deg);
      }
      transition: transform 0.5s ease-in-out;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: relative;
    bottom: 0; right: 0;
    justify-content: center;
    align-items: center;
  `};
`

export const CollectionLabel = styled(Row)<{ isNavOpen: boolean; active: boolean; bgColor?: string | null }>`
  font-weight: ${({ active }) => (active ? 700 : 300)};
  padding: 0 1rem;
  gap: 1rem;

  ${({ active, bgColor }) =>
    active &&
    `
      color: ${setBestTextColour(bgColor || TRANSPARENT_HEX, 2, true)};
      background-color: ${bgColor || TRANSPARENT_HEX};
      text-decoration: line-through;
      text-decoration-thickness: from-font;
      width: 100%;
    `}

  ${({ isNavOpen, bgColor }) =>
    isNavOpen &&
    `
    color: ${setBestTextColour(bgColor || '#6161a3', 2, true)};
    background: linear-gradient(267deg,${bgColor || '#6161a3'} 33%,transparent);
  `}
`

export const SideEffectNavLink = styled.span`
  cursor: pointer;
`

export const StyledNav = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  > ul {
    padding: 0;
  }
`

// #1d1d1d
export const InnerNavWrapper = styled(Column)<{ bgColor?: string | null; $width: string }>`
  overflow-y: auto;
  width: ${({ $width }) => $width};
  background-color: ${({ theme, bgColor }) => bgColor || theme.blackOpaqueMore};
  padding: 1rem;

  > div {
    width: 100%;
    padding: 0;
  }
`

export const NavRowItem = styled(Row).attrs((props) => ({
  backgroundColor: props.backgroundColor || getThemeColours('DEFAULT').blackLight,
  fontSize: props.fontSize || '1rem',
  fontWeight: props.fontWeight || 600,
  justifyContent: props.justifyContent || 'space-between',
  padding: '1.25rem',
  width: '100%',
}))`
  cursor: pointer;

  ${upToSmall`
    span.nav-policy-title {
      font-size: 2rem;
      font-weight: 100;
    }
  `}
`

export const PolicyColumnWrapper = styled(Column)`
  text-transform: uppercase;
  width: 100%;
  margin-top: 1rem;
  gap: 0.55rem;
  font-size: 1.2rem;
  padding: 1rem 0 0;

  > span,
  > a {
    border-radius: 2px;
    background-color: #7b6ba1;
    &#instagram-link {
      text-transform: lowercase;
      background: ${(props) => `linear-gradient(90deg, ${props.theme.purple} 0%, deeppink 100%)`};
    }
    padding: 0.3rem 0.8rem 0.3rem 0.5rem;
    color: ghostwhite !important;
    text-align: center;
    text-transform: lowercase;

    flex: 1 1 auto;

    &:hover {
      filter: invert(1);
    }

    transition: filter 0.3s ease-in-out;
  }

  > small {
    margin-top: 0.5rem;
    text-transform: initial;
    font-variation-settings: 'wght' 100;
    font-weight: 100;
  }

  ${upToSmall`
    font-size: 2rem;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 2rem;

    > a#instagram-link, > span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      
      &:not(span) {
        font-variation-settings: 'wght' 200;
      }
    }

    > small {
      display: block;
      width: 100%;
    }
  `}
`

export const ExternalLink = styled.a``
