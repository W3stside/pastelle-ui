import { Row } from '@past3lle/components'
import { useIsMediumMediaWidth } from '@past3lle/hooks'
import { getIsMobile } from '@past3lle/utils'
import Navigation from 'components/Navigation'
import { ShoppingCartHeader } from 'components/ShoppingCart'
import { Web3LoginButton } from 'components/Web3LoginButton'
import { FREE_SHIPPING_THRESHOLD } from 'constants/config'
import { COLLECTION_PATHNAME } from 'constants/navigation'
import { FreeShippingBanner, ProductSubHeader } from 'pages/common/styleds'
import { useMemo, useState } from 'react'
import { Truck } from 'react-feather'
import { useLocation } from 'react-router-dom'
import { useCurrentCollection, useCurrentProductMedia, useGetAllProductLogos } from 'state/collection/hooks'
import { CollectionID } from 'state/collection/reducer'
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

  const { collection: currentCollection } = useCurrentCollection()

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
        <Title to={`${COLLECTION_PATHNAME}/${(currentCollection?.id as CollectionID) || ''}`}>
          <Pastellecon />
        </Title>

        {/* THEME TOGGLE - ONLY MEDIUM */}
        <StyledThemeToggleBar themeToggleProps={{ width: '90%' }} />
        {/* WEB3 CONNECT BUTTON */}
        <Web3LoginButton>LOGIN</Web3LoginButton>
        <Row id="cart-shipping-banner" flex="row nowrap" gap="1rem" height="100%">
          {/* FREE SHIPPING LABEL */}
          {FREE_SHIPPING_THRESHOLD && (
            <FreeShippingBanner
              gap="0"
              fontWeight={300}
              flex="auto"
              height="100%"
              minWidth="14rem"
              padding="0.75rem 1rem"
              fontSize={'1.5rem'}
            >
              <Truck /> {`FREE @ ${FREE_SHIPPING_THRESHOLD}€`}
            </FreeShippingBanner>
          )}
          {/* SHOPPING CART */}
          <ShoppingCartHeader />
        </Row>
        {isMediumOrBelow && <Navigation navOrbProps={{ bgColor: 'transparent', menuSize: 30 }} />}
      </HeaderRow>
    </HeaderFrame>
  )
}
