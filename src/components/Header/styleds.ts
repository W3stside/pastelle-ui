import styled from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import { Text } from 'rebass'

import { RowFixed, Row, YellowCard } from 'components/Layout'
import { SectionFrame } from 'components/Layout/Section'
import { MobileNavOrb } from 'components/Navigation/styled'
import { ShoppingCartFullWrapper } from 'components/ShoppingCart/styled'
import { upToExtraSmall, fromMedium, OFF_WHITE } from 'theme/utils'

export const StyledNavLink = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
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

export const HeaderFrame = styled(SectionFrame)`
  top: 0;
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
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const HeaderRow = styled(RowFixed)`
  width: 100%;

  > ${ShoppingCartFullWrapper} {
    margin-left: auto;
    margin-right: 2rem;
  }
  ${upToExtraSmall`
    > ${MobileNavOrb} {
      margin-left: auto;
    }
    // shop cart is only in footer
    > ${ShoppingCartFullWrapper} {
      display: none;      
    }
  `}

  ${fromMedium`
      nav {
        display: none;
      }
  `};
`

export const HeaderLinks = styled(Row)`
  width: max-content;
  margin-right: auto;
  justify-content: center;
  padding: 1rem;

  > a {
    white-space: nowrap;
    flex: 1 0 auto;

    font-size: 2rem;
    font-weight: 300;
    color: ghostwhite;
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
  
  border-radius: 12px;
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
  border-radius: 12px;
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

export const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

export const Pastellecon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    > img {
      width: 90px;
    }
`};
`
