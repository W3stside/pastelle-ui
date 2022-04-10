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
import { isMobile } from 'utils'
import { useLocation } from 'react-router-dom'
import { CATALOG_URL } from 'constants/navigation'

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
`

const HeaderLinks = styled(Row)`
  width: min-content;
  justify-content: center;
  padding: 5px;
  margin-left: 15px;

  > a {
    white-space: nowrap;
    flex: 1 0 auto;

    font-size: 18px;
    font-weight: 300;
    color: ghostwhite;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 12px;
    `};
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
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

const Title = styled.a`
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

// const StyledExternalLink = styled(ExternalLink).attrs({
//   activeClassName
// })<{ isActive?: boolean }>`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;
//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;

//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: none;
// `}
// `

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
        <Title href="/#">
          <Pastellecon>{constructedLogo && <img width="170px" src={constructedLogo} alt="logo" />}</Pastellecon>
        </Title>
        {/* <DynamicHeaderLogo itemColor="#dda0ddb3" fontSize={60} fontWeight={100} color={'ghostwhite'} /> */}
        {location.pathname !== CATALOG_URL && (
          <HeaderLinks id="header-links-container">
            <StyledNavLink to={CATALOG_URL}>{'FULL CATALOG'}</StyledNavLink>
            {/* <StyledNavLink to="/aboutus">{'// ABOUT US'}</StyledNavLink> */}
            {/* <StyledNavLink to="#">Header Link</StyledNavLink> */}
            {/* <StyledExternalLink href="#">
            External Link <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink> */}
          </HeaderLinks>
        )}
        {isMobile && <Navigation navOrbProps={{ bgColor: 'transparent', menuSize: 30 }} />}
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
