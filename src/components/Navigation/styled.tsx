import { Button, Column, Row } from '@past3lle/components'
import {
  BLACK,
  OFF_WHITE,
  setBackgroundWithDPI,
  setBestTextColour,
  setFlickerAnimation,
  upToMedium,
  upToSmall,
} from '@past3lle/theme'
import { Z_INDEXES } from 'constants/config'
import styled from 'styled-components/macro'
import { getThemeColours } from 'theme'
import { ShopImageSrcSet } from 'types'

import { MobileNavProps } from '.'

export const NavigationStepsWrapper = styled.nav<{
  isOpen?: boolean
  width?: string
  minWidth?: string
  currentMedia: { navLogoSet?: ShopImageSrcSet; color?: string }
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

  ${({ theme, currentMedia: { navLogoSet, color = BLACK } }) =>
    setBackgroundWithDPI(theme, navLogoSet, {
      preset: 'navbar',
      modeColours: [color, BLACK],
    })}

  z-index: 1;

  > a {
    font-size: 1.6rem;
  }

  z-index: ${Z_INDEXES.NAV_MENU};

  ${setFlickerAnimation({ state: true, duration: 4, count: 2 })}

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
      // background: linear-gradient(267deg, #000000c2 33%, transparent);
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
  background: ${({ theme, bgColor = theme.red2 }) => bgColor};
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

export const CollectionLabel = styled(Row)<{ isNavOpen: boolean; active: boolean; bgColor?: string }>`
  font-weight: ${({ active }) => (active ? 700 : 300)};
  padding: 0 1rem;
  gap: 1rem;

  ${({ active, bgColor = 'transparent' }) =>
    active &&
    `
      color: ${setBestTextColour(bgColor)};
      background-color: ${bgColor};
      text-decoration: line-through;
      text-decoration-thickness: from-font;
      width: 100%;
    `}

  ${({ isNavOpen, bgColor = OFF_WHITE }) =>
    isNavOpen &&
    `
    color: ${setBestTextColour(bgColor)};
    background: linear-gradient(267deg,${bgColor} 33%,transparent);
  `}
`

export const SideEffectNavLink = styled.span`
  cursor: pointer;
`

// #1d1d1d
export const InnerNavWrapper = styled(Column)<{ bgColor?: string; $width: string }>`
  overflow-y: auto;
  width: ${({ $width }) => $width};
  background-color: ${({ theme, bgColor = theme.blackOpaqueMore }) => bgColor};
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

  > span {
    color: inherit;
    background-color: ${(props) => props.theme.purple};
    padding: 0.3rem 0.8rem 0.3rem 0.5rem;
    color: black;
    font-style: italic;
    text-align: center;
  }

  ${upToSmall`
    font-size: 2rem;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    padding: 2rem;
  `}
`
