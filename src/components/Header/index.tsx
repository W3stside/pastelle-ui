import { useIsMediumMediaWidth } from '@past3lle/hooks'
import { isMobile } from '@past3lle/utils'
import Navigation from 'components/Navigation'
import { ShoppingCartHeader } from 'components/ShoppingCart'
import { Web3LoginButton } from 'components/Web3LoginButton'
import { COLLECTION_PATHNAME } from 'constants/navigation'
import { ProductSubHeader } from 'pages/common/styleds'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCurrentProductMedia, useGetAllProductLogos } from 'state/collection/hooks'
// import { isWeb3Enabled } from 'utils/blockchain'
import { checkIsCollectionPage } from 'utils/navigation'

import { HeaderDrawerButton, HeaderFrame, HeaderRow, Pastellecon, StyledThemeToggleBar, Title } from './styleds'

export default function Header() {
  const location = useLocation()
  const isCollectionPage = checkIsCollectionPage(location)
  // const isEnabled = useMemo(() => isWeb3Enabled(), [])

  const isMediumOrBelow = useIsMediumMediaWidth()

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
        <Title to={COLLECTION_PATHNAME}>
          <Pastellecon />
        </Title>

        {/* THEME TOGGLE - ONLY MEDIUM */}
        <StyledThemeToggleBar themeToggleProps={{ width: '90%' }} />
        {/* WEB3 CONNECT BUTTON */}
        <Web3LoginButton>LOGIN</Web3LoginButton>
        {/* SHOPPING CART */}
        <ShoppingCartHeader />
        {isMediumOrBelow && <Navigation navOrbProps={{ bgColor: 'transparent', menuSize: 30 }} />}
      </HeaderRow>
    </HeaderFrame>
  )
}
