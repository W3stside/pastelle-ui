import { PNG } from '@past3lle/assets'
import { Header, Row, RowFixed } from '@past3lle/components'
import {
  BLACK,
  OFF_WHITE,
  ThemeModes,
  betweenSmallAndMedium,
  fromExtraSmall,
  fromMedium,
  getThemeColours,
  setBackgroundWithDPI,
  setBestTextColour,
  upToExtraSmall,
  upToSmallHeight,
} from '@past3lle/theme'
import { YellowCard } from 'components/Layout'
import { MobileNavOrb } from 'components/Navigation/styled'
import { ShoppingCartFullWrapper } from 'components/ShoppingCart/styled'
import ThemeToggleBar from 'components/ThemeToggler'
import { Z_INDEXES } from 'constants/config'
import { ProductSubHeader } from 'pages/common/styleds'
import { darken, transparentize } from 'polished'
import { NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { ShopImageSrcSet } from 'types'

const DEFAULT_BG = transparentize(0.3, getThemeColours(ThemeModes.DARK).bg1)

export const StyledNavLink = styled(NavLink)`
  display: flex;
  flex-flow: row nowrap;
  align-items: left;
  border-radius: ${({ theme }) => theme.buttons.borderRadius};
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: ${({ theme }) => theme.buttons.font.size.normal};
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const BalanceText = styled(Text)`
  font-weight: 500;
  padding: 0 6px 0 12px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    overflow: hidden;
    max-width: 100px;
    text-overflow: ellipsis;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`

export const HeaderElement = styled.div`
  background: ${OFF_WHITE};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.buttons.borderRadius};
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;

  :hover {
    cursor: pointer;
  }
`

export const StyledThemeToggleBar = styled(ThemeToggleBar)``

export const HeaderRow = styled(RowFixed)`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(7.5rem, 16rem) auto min-content min-content;
  grid-gap: 1rem;
  z-index: 1;

  > ${Title} {
    height: 100%;
    width: 100%;
  }

  > ${StyledThemeToggleBar} {
    display: none;
  }

  > ${ShoppingCartFullWrapper} {
    margin-left: auto;
  }

  ${upToExtraSmall`
    > ${MobileNavOrb} {
      margin-left: auto;
    }
  `}

  ${fromMedium`
      nav {
        display: none;
      }
  `};

  ${betweenSmallAndMedium`
      grid-template-columns: minmax(10rem, 16rem) auto 11rem min-content min-content;
      
      > ${StyledThemeToggleBar} {
        display: flex;
        margin-left: auto;
        max-width: 11rem;
      }
  `}
`

export const HeaderDrawerButton = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(267deg, ${({ theme }) => theme.blackOpaque2} 13%, transparent);
  padding: 0 2rem;
  font-size: 2vw;
  cursor: pointer;

  > ${ProductSubHeader} {
    color: white;
  }
`
export const HeaderFrame = styled(Header)<{ open: boolean; color?: string; logoSet?: ShopImageSrcSet }>`
  top: 0;
  padding: 1rem;

  z-index: ${Z_INDEXES.HEADER};

  ${({ theme, color = BLACK, logoSet }) =>
    logoSet &&
    setBackgroundWithDPI(theme, logoSet, {
      preset: 'header',
      modeColours: [color, BLACK],
    })}

  // HIDE HEADER ON SMALL HEIGHT LANDSCAPE BOIS
  ${({ open }) => upToSmallHeight`
    height: ${open ? 'initial' : '2.4rem'};
    overflow: ${open ? 'unset' : 'hidden'};

    > ${HeaderDrawerButton} {
      display: flex;
      height: ${!open ? '100%' : 'unset'};
      align-items: center;
      text-align: right;
    }
    
    > ${HeaderRow} {
      display: ${open ? 'grid' : 'none'};

      > ${ShoppingCartFullWrapper}, > ${MobileNavOrb} {
        margin-bottom: 2rem;
      }
    }
  `}

  transition: left,height 0.2s ease-in-out;
`

export const HeaderLinks = styled(Row)<{ color?: string }>`
  width: max-content;
  margin-right: auto;
  justify-content: center;
  padding: 1rem;

  border-radius: 0.5rem;
  background-color: ${({ color }) => (color ? darken(0.03, color) : DEFAULT_BG)};

  > a {
    color: ${({ color = DEFAULT_BG }) => setBestTextColour(color)};
    white-space: nowrap;
    flex: 1 0 auto;

    font-size: 2rem;
    font-weight: 300;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: auto;
    > a {
      font-size: 1.5rem;
    }
  `};
`

export const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  border-radius: ${({ theme }) => theme.buttons.borderRadius};
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`

export const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

export const NetworkCard = styled(YellowCard)`
  border-radius: ${({ theme }) => theme.buttons.borderRadius};
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

export const Pastellecon = styled.div`
  height: 100%;
  width: 100%;
  transition: transform 0.3s ease;

  background: url(${PNG.LogoShort_2x}) left/contain no-repeat;
  ${fromExtraSmall`background: url(${PNG.LogoFull_2x}) left/contain no-repeat;`}

  &:hover {
    transform: rotate(-5deg);
  }
`
