import { isMobile } from '@past3lle/utils'
import { useWeb3React } from '@web3-react/core'
import { isWeb3Enabled } from 'blockchain/connectors'
import { NETWORK_LABELS } from 'blockchain/constants'
import { useNativeCurrencyBalances } from 'blockchain/hooks/useCurrencyBalance'
import Navigation from 'components/Navigation'
import { ShoppingCartHeader } from 'components/ShoppingCart'
import Web3Status from 'components/blockchain/Web3Status'
import { ProductSubHeader } from 'pages/common/styleds'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCurrentProductMedia, useGetAllProductLogos } from 'state/collection/hooks'
import { useIsMediumWindowWidthSize } from 'state/window/hooks'
import { checkIsCollectionPage } from 'utils/navigation'

import {
  AccountElement,
  BalanceText,
  HeaderControls,
  HeaderDrawerButton,
  HeaderElement,
  HeaderFrame,
  HeaderRow,
  HideSmall,
  NetworkCard,
  Pastellecon,
  StyledThemeToggleBar,
  Title,
} from './styleds'

export default function Header() {
  const location = useLocation()
  const isCollectionPage = checkIsCollectionPage(location)
  const isEnabled = useMemo(() => isWeb3Enabled(), [])

  const isMediumOrBelow = useIsMediumWindowWidthSize()

  const productLogos = useGetAllProductLogos()
  const { headerLogoSet: dynamicHeaderLogoSet, color } = useCurrentProductMedia()
  // "randomly" select a product header from collection for header (on mobile collection view ONLY)
  const staticRandomLogoSet = useMemo(
    () => productLogos?.[Math.ceil(Math.random() * productLogos.length - 1)]?.headerLogo,
    // only update when navving in-out of collection page on mobile
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCollectionPage]
  )

  // only applicable for certain view sizes..
  const [open, setOpen] = useState(false)

  return (
    <HeaderFrame
      as="header"
      color={color}
      logoSet={isMobile && isCollectionPage ? staticRandomLogoSet : dynamicHeaderLogoSet}
      open={open}
    >
      <HeaderDrawerButton onClick={() => setOpen((state) => !state)}>
        <ProductSubHeader padding="0" margin="0">
          TAP TO {open ? 'HIDE' : 'VIEW CART + MENU'}
        </ProductSubHeader>
      </HeaderDrawerButton>
      <HeaderRow>
        {/* ICON and HOME BUTTON */}
        <Title to="/#">
          <Pastellecon />
        </Title>

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
