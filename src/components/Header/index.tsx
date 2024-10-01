import { Column, Row } from '@past3lle/components'
import { useIsMediumMediaWidth } from '@past3lle/hooks'
import Navigation from '@/components/Navigation'
import { ShoppingCartHeader } from '@/components/ShoppingCart/ShoppingCart'
import { Web3LoginButton } from '@/components/Web3LoginButton'
import { FREE_SHIPPING_THRESHOLD, TRANSPARENT_HEX } from '@/constants/config'
import { COLLECTION_PATHNAME } from '@/constants/navigation'
import { FORGE_WEB3_ENABLED } from '@/constants/flags'
import { ProductSubHeader } from '@/components/PagesComponents/styleds'
import { useState } from 'react'
import { Truck } from 'react-feather'

import { HeaderDrawerButton, HeaderFrame, HeaderH1, Pastellecon, Title } from './styleds'
import { useIsClientReady } from '@/hooks/useIsClientReady'
import dynamic from 'next/dynamic'
import { useHeaderMedia } from './hooks'

// Relies on client side tech - load async // SSR = false
const DynamicThemeToggler = dynamic(
  () =>
    import(/* webpackPrefetch: true,  webpackChunkName: "THEME_TOGGLE_BAR" */ './styleds').then(
      (module) => module.StyledThemeToggleBar,
    ),
  { ssr: true },
)
// Relies on client side tech - load async // SSR = false
const DynamicHeaderRow = dynamic(
  () =>
    import(/* webpackPrefetch: true,  webpackChunkName: "HEADER_ROW" */ './styleds').then((module) => module.HeaderRow),
  { ssr: true },
)
// Relies on client side tech - load async // SSR = false
const DynamicFreeShippingBanner = dynamic(
  () =>
    import(
      /* webpackPrefetch: true,  webpackChunkName: "FREE_SHIPPING_BANNER" */ '@/components/PagesComponents/styleds'
    ).then((module) => module.FreeShippingBanner),
  { ssr: true },
)

export default function Header() {
  const clientReady = useIsClientReady()

  // const isEnabled = useMemo(() => isWeb3Enabled(), [])
  const isMediumOrBelow = useIsMediumMediaWidth()
  // Header content: logos and color
  const { headerLogo, color } = useHeaderMedia()
  // only applicable for certain view sizes..
  const [open, setOpen] = useState(false)

  return (
    <HeaderFrame as="header" color={color} logoSet={headerLogo} open={false}>
      <HeaderDrawerButton onClick={() => setOpen((state) => !state)}>
        <ProductSubHeader padding="0" margin="0">
          TAP TO {open ? 'HIDE' : 'VIEW CART + MENU'}
        </ProductSubHeader>
      </HeaderDrawerButton>
      <DynamicHeaderRow>
        {/* ICON and HOME BUTTON */}
        <Column height="100%">
          <Title href={COLLECTION_PATHNAME}>
            <Pastellecon />
            <br />
          </Title>
          <Row width="100%" height="30%" alignItems="center">
            <HeaderH1>
              HEAVY.ORGANIC. <span>STREETWEAR.</span>
              PORTUGAL.
            </HeaderH1>
          </Row>
        </Column>

        {/* THEME TOGGLE - ONLY MEDIUM */}
        <DynamicThemeToggler themeToggleProps={{ width: '90%' }} />
        {/* WEB3 CONNECT BUTTON */}
        {FORGE_WEB3_ENABLED && <Web3LoginButton>LOGIN</Web3LoginButton>}
        <Row id="cart-shipping-banner" flex="row nowrap" gap="1rem" height="100%" justifyContent="flex-end">
          {/* FREE SHIPPING LABEL */}
          {FREE_SHIPPING_THRESHOLD && (
            <DynamicFreeShippingBanner
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
            </DynamicFreeShippingBanner>
          )}
          {/* SHOPPING CART */}
          <ShoppingCartHeader styleProps={{ justifyContent: 'flex-end', maxWidth: 'min-content' }} />
        </Row>
        {clientReady && isMediumOrBelow && <Navigation navOrbProps={{ bgColor: TRANSPARENT_HEX, menuSize: 30 }} />}
      </DynamicHeaderRow>
    </HeaderFrame>
  )
}
