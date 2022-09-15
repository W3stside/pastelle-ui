import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'

import {
  AccountElement,
  BalanceText,
  HeaderControls,
  HeaderElement,
  HeaderFrame,
  HeaderLinks,
  HeaderRow,
  HideSmall,
  NetworkCard,
  Pastellecon,
  StyledNavLink,
  Title
} from './styleds'
import Navigation from 'components/Navigation'
import { ShoppingCartHeader } from 'components/ShoppingCart'
import Web3Status from 'components/blockchain/Web3Status'

import PastelleLogoSharpShort from 'assets/svg/PSTL-sharp.svg'
import PastelleLogoCursiveLong from 'assets/svg/pastelle-cursive-logo.svg'

import { useNativeCurrencyBalances } from 'blockchain/hooks/useCurrencyBalance'
import { useGetWindowSize } from 'state/window/hooks'

import { DEFAULT_COLLECTION_URL } from 'constants/config'
import { COLLECTION_PARAM_NAME } from 'constants/navigation'
import { NETWORK_LABELS } from 'blockchain/constants'
import { MEDIA_WIDTHS } from 'theme/styles/mediaQueries'

import { checkIsCollectionPage } from 'utils/navigation'
import { isWeb3Enabled } from 'blockchain/connectors'

export default function Header() {
  const location = useLocation()
  const sizes = useGetWindowSize()

  const isEnabled = useMemo(() => isWeb3Enabled(), [])

  const constructedLogo = useMemo(() => {
    if (!sizes?.width) return null

    if (sizes.width < MEDIA_WIDTHS.upToExtraSmall) {
      return PastelleLogoSharpShort
      // width < 960px
    } else {
      return PastelleLogoCursiveLong
    }
  }, [sizes])

  return (
    <HeaderFrame as="header">
      <HeaderRow>
        {/* ICON and HOME BUTTON */}
        <Title to="/#">
          <Pastellecon>{constructedLogo && <img width="17rem" src={constructedLogo} alt="logo" />}</Pastellecon>
        </Title>
        {/* NAV */}
        {!checkIsCollectionPage(location) && (
          <HeaderLinks id="header-links-container">
            <StyledNavLink to={DEFAULT_COLLECTION_URL}>FULL {COLLECTION_PARAM_NAME}</StyledNavLink>
          </HeaderLinks>
        )}
        {/* WEB3 */}
        {isEnabled && <Web3StatusHeader />}
        {/* SHOPPING CART */}
        <ShoppingCartHeader />
        <Navigation navOrbProps={{ bgColor: 'transparent', menuSize: 30 }} />
      </HeaderRow>
    </HeaderFrame>
  )
}

function Web3StatusHeader() {
  const { account, chainId } = useWeb3React()
  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']

  return (
    <HeaderControls>
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
    </HeaderControls>
  )
}
