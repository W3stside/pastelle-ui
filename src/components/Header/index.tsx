import styled from 'styled-components/macro'

// import { useActiveWeb3React } from 'blockchain/hooks'
// import { ExternalLink } from 'theme'

// import Menu from 'components/Menu'
// import DynamicHeaderLogo from 'components/Header/DynamicLogoHeader'
import { Row, RowFixed /*, YellowCard */ } from 'components/Layout'
import { SectionFrame } from 'components/Layout/Section'

// import { NETWORK_LABELS } from 'blockchain/constants'
import { StyledNavLink } from './styleds'

import PastelleLogoSharpShort from 'assets/svg/PSTL-sharp.svg'
import PastelleLogoCursiveLong from 'assets/svg/pastelle-cursive-logo.svg'
import { useMemo } from 'react'
import { useWindowSize } from 'hooks/useWindowSize'
import { MEDIA_WIDTHS } from 'theme/styles/mediaQueries'
import Navigation from 'components/Navigation'
import { NavLink, useLocation } from 'react-router-dom'
import { DEFAULT_CATALOG_URL } from 'constants/config'
import { ShoppingCartHeader } from 'components/ShoppingCart'
import { fromMedium, upToExtraSmall } from 'theme/utils'
import { ShoppingCartFullWrapper } from 'components/ShoppingCart/styled'
import { MobileNavOrb } from 'components/Navigation/styled'

const HeaderFrame = styled(SectionFrame)`
  top: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

/* const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
` */

const HeaderRow = styled(RowFixed)`
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

const HeaderLinks = styled(Row)`
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

// const AccountElement = styled.div<{ active: boolean }>`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
//   border-radius: 12px;
//   white-space: nowrap;
//   width: 100%;
//   cursor: pointer;

//   :focus {
//     border: 1px solid blue;
//   }
//   /* :hover {
//     background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
//   } */
// `

// const HideSmall = styled.span`
//  ${({ theme }) => theme.mediaWidth.upToSmall`
//    display: none;
//  `};
// `

/* const NetworkCard = styled(YellowCard)`
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
` */

const Title = styled(NavLink)`
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

const Pastellecon = styled.div`
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

export default function Header() {
  // const { chainId } = useActiveWeb3React()
  const location = useLocation()
  const { width } = useWindowSize()

  const constructedLogo = useMemo(() => {
    if (!width) return null
    if (width < MEDIA_WIDTHS.upToExtraSmall) {
      return PastelleLogoSharpShort
      // width < 960px
    } else {
      return PastelleLogoCursiveLong
    }
  }, [width])

  return (
    <HeaderFrame as="header">
      <HeaderRow>
        <Title to="/#">
          <Pastellecon>{constructedLogo && <img width="170px" src={constructedLogo} alt="logo" />}</Pastellecon>
        </Title>
        {/* <DynamicHeaderLogo itemColor="#dda0ddb3" fontSize={60} fontWeight={100} color={'ghostwhite'} /> */}
        {location.pathname !== DEFAULT_CATALOG_URL && (
          <HeaderLinks id="header-links-container">
            <StyledNavLink to={DEFAULT_CATALOG_URL}>{'FULL CATALOG'}</StyledNavLink>
            {/* <StyledNavLink to="/aboutus">{'// ABOUT US'}</StyledNavLink> */}
            {/* <StyledNavLink to="#">Header Link</StyledNavLink> */}
            {/* <StyledExternalLink href="#">
            External Link <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink> */}
          </HeaderLinks>
        )}
        <ShoppingCartHeader />
        <Navigation navOrbProps={{ bgColor: 'transparent', menuSize: 30 }} />
      </HeaderRow>
      {/* <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} ETH
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap><Menu /></HeaderElementWrap>
      </HeaderControls>*/}
    </HeaderFrame>
  )
}
