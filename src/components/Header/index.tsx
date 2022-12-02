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
  StyledThemeToggleBar,
  Title
} from './styleds'
import Navigation from 'components/Navigation'
import { ShoppingCartHeader } from 'components/ShoppingCart'
import Web3Status from 'components/blockchain/Web3Status'

import { useNativeCurrencyBalances } from 'blockchain/hooks/useCurrencyBalance'

import { DEFAULT_COLLECTION_URL } from 'constants/config'
import { COLLECTION_PARAM_NAME } from 'constants/navigation'
import { NETWORK_LABELS } from 'blockchain/constants'

import { checkIsCollectionPage } from 'utils/navigation'
import { isWeb3Enabled } from 'blockchain/connectors'
import { useIsMediumWindowWidthSize } from 'state/window/hooks'
import { useCurrentProductMedia } from 'state/collection/hooks'
import useStateRef from 'hooks/useStateRef'
// import { HeaderLogo } from 'components/BackgroundLogo'
import { SkipBack } from 'react-feather'

export default function Header() {
  const location = useLocation()
  const isEnabled = useMemo(() => isWeb3Enabled(), [])
  const { headerLogoSet, color } = useCurrentProductMedia()
  const [, /* node */ setNodeRef] = useStateRef<HTMLDivElement | null>(null, node => node)

  const isMediumOrBelow = useIsMediumWindowWidthSize()

  return (
    <HeaderFrame as="header" ref={setNodeRef} color={color} logoSet={headerLogoSet}>
      {/* <HeaderLogo parentNode={node} logoSrcSet={headerLogoSet} /> */}
      <HeaderRow>
        {/* ICON and HOME BUTTON */}
        <Title to="/#">
          <Pastellecon />
        </Title>
        {/* NAV */}
        {!checkIsCollectionPage(location) && (
          <HeaderLinks id="header-links-container" color={color}>
            <StyledNavLink to={DEFAULT_COLLECTION_URL} style={{ alignItems: 'center', gap: '0.5rem' }}>
              <SkipBack size={12} /> {COLLECTION_PARAM_NAME.toLocaleUpperCase()}
            </StyledNavLink>
          </HeaderLinks>
        )}
        {/* WEB3 */}
        {isEnabled && <Web3StatusHeader />}
        {/* THEME TOGGLE - ONLY MEDIUM */}
        <StyledThemeToggleBar themeToggleProps={{ width: '90%' }} />
        {/* SHOPPING CART */}
        <ShoppingCartHeader />
        {isMediumOrBelow && <Navigation navOrbProps={{ bgColor: 'transparent', menuSize: 30 }} />}
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
