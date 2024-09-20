import { Column, Row, Text } from '@past3lle/components'
import { useIsMediumMediaWidth } from '@past3lle/hooks'
import { getIsMobile } from '@past3lle/utils'
import Navigation from '@/components/Navigation'
import { ShoppingCartHeader } from '@/components/ShoppingCart'
import { Web3LoginButton } from '@/components/Web3LoginButton'
import { FREE_SHIPPING_THRESHOLD, TRANSPARENT_HEX } from '@/constants/config'
import { COLLECTION_PATHNAME } from '@/constants/navigation'
import { FORGE_WEB3_ENABLED } from '@/constants/flags'
import { FreeShippingBanner, ProductSubHeader } from '@/pages/common/styleds'
import { useMemo, useState } from 'react'
import { Truck } from 'react-feather'
import { useLocation } from 'react-router-dom'
import { useCurrentProductMedia, useGetAllProductLogos } from '@/state/collection/hooks'
import { checkIsCollectionPage } from 'utils/navigation'

import { HeaderDrawerButton, HeaderFrame, HeaderRow, Pastellecon, StyledThemeToggleBar, Title } from './styleds'

export default function Header() {
  const location = useLocation()
  const isCollectionPage = checkIsCollectionPage(location)
  // const isEnabled = useMemo(() => isWeb3Enabled(), [])

  const isMediumOrBelow = useIsMediumMediaWidth()

  const productLogos = useGetAllProductLogos()
  const { headerLogoSet: dynamicHeaderLogoSet, color } = useCurrentProductMedia(location.pathname === '/')
  // "randomly" select a product header from collection for header (on mobile collection view ONLY)
  const staticRandomLogoSet = useMemo(
    () => productLogos?.[Math.ceil(Math.random() * productLogos.length - 1)]?.headerLogo,
    // only update when navving in-out of collection page on mobile
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCollectionPage],
  )

  // only applicable for certain view sizes..
  const [open, setOpen] = useState(false)

  return (
    <HeaderFrame
      as="header"
      color={color}
      logoSet={getIsMobile() && isCollectionPage ? staticRandomLogoSet : dynamicHeaderLogoSet}
      open={open}
    >
      <HeaderDrawerButton onClick={() => setOpen((state) => !state)}>
        <ProductSubHeader padding="0" margin="0">
          TAP TO {open ? 'HIDE' : 'VIEW CART + MENU'}
        </ProductSubHeader>
      </HeaderDrawerButton>
      <HeaderRow>
        {/* ICON and HOME BUTTON */}
        <Column height="100%">
          <Title to={`${COLLECTION_PATHNAME}/latest`}>
            <Pastellecon />
            <br />
          </Title>
          <Row width="100%" height="30%" alignItems="center">
            <h1 style={{ fontSize: '0.6rem', margin: 0, fontVariationSettings: "'wght' 100" }}>
              HEAVY.ORGANIC.{' '}
              <Text.Main fontSize="inherit" fontWeight={800} display={'inline-block'}>
                STREETWEAR.
              </Text.Main>
              PORTUGAL.
            </h1>
          </Row>
        </Column>

        {/* THEME TOGGLE - ONLY MEDIUM */}
        <StyledThemeToggleBar themeToggleProps={{ width: '90%' }} />
        {/* WEB3 CONNECT BUTTON */}
        {FORGE_WEB3_ENABLED && <Web3LoginButton>LOGIN</Web3LoginButton>}
        <Row id="cart-shipping-banner" flex="row nowrap" gap="1rem" height="100%" justifyContent="flex-end">
          {/* FREE SHIPPING LABEL */}
          {FREE_SHIPPING_THRESHOLD && (
            <FreeShippingBanner
              gap="0"
              fontWeight={300}
              flex="auto"
              height="100%"
              minWidth="14rem"
              maxWidth="min-content"
              marginLeft="auto"
              padding="0.75rem 1rem"
              fontSize="1.5rem"
            >
              <Truck /> {`FREE @ ${FREE_SHIPPING_THRESHOLD}€`}
            </FreeShippingBanner>
          )}
          {/* SHOPPING CART */}
          <ShoppingCartHeader styleProps={{ justifyContent: 'flex-end', maxWidth: 'min-content' }} />
        </Row>
        {isMediumOrBelow && <Navigation navOrbProps={{ bgColor: TRANSPARENT_HEX, menuSize: 30 }} />}
      </HeaderRow>
    </HeaderFrame>
  )
}
