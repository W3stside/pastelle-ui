import { Column, Row, SpinnerCircle, Text } from '@past3lle/components'
import { useIsSmallMediaWidth, useOnResize } from '@past3lle/hooks'
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { Menu, X } from 'react-feather'
import { BLACK_TRANSPARENT } from 'theme'

import { InnerNavWrapper, MobileNavOrb, NavigationStepsWrapper } from './styled'

const InnerNavigation = lazy(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "INNER_NAVIGATION" */ './InnerNav')
)

export type MobileNavProps = { menuSize?: number; bgColor?: string }

export default function Navigation({
  navOrbProps,
  mobileHide,
}: {
  navOrbProps?: MobileNavProps
  mobileHide?: boolean
}) {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const isSmallWidth = useIsSmallMediaWidth()
  useEffect(() => {
    setIsNavOpen(!isSmallWidth)
  }, [isSmallWidth])

  const toggleNav = useCallback(() => {
    if (isNavOpen) {
      setIsNavOpen(false)
    } else {
      setIsNavOpen(true)
    }
  }, [isNavOpen])

  const NavToggleButton = useMemo(() => {
    return (
      <Row alignItems={'center'} gap="1rem">
        {isNavOpen ? <X size={20} /> : <Menu size={navOrbProps?.menuSize || 20} />}
      </Row>
    )
  }, [isNavOpen, navOrbProps?.menuSize])

  // close open nav on resize
  useOnResize(() => setIsNavOpen(false), isNavOpen)

  return (
    <>
      <MobileNavOrb onClick={toggleNav} mobileHide={mobileHide} {...navOrbProps}>
        {NavToggleButton}
      </MobileNavOrb>
      {/* <NavigationFallback isNavOpen={isNavOpen} /> */}
      <Suspense fallback={<NavigationFallback isSmallNav={isSmallWidth} isNavOpen={isNavOpen} />}>
        {((isSmallWidth && isNavOpen) || !isSmallWidth) && (
          <InnerNavigation isNavOpen={isSmallWidth && isNavOpen} toggleNav={toggleNav} />
        )}
      </Suspense>
    </>
  )
}

function NavigationFallback({ isSmallNav, isNavOpen }: { isSmallNav: boolean; isNavOpen: boolean }) {
  return (
    <NavigationStepsWrapper
      isOpen={isNavOpen}
      minWidth="9vw"
      width="16.5rem"
      currentMedia={{ fallbackColor: BLACK_TRANSPARENT }}
    >
      {/* <NavLogo parentNode={parentNode} logoSrcSet={currentProduct?.navLogo} /> */}
      <InnerNavWrapper $width="100%" height={'100%'}>
        <Column height="100%" justifyContent={'center'} alignItems={'center'} gap="1rem">
          <SpinnerCircle size={70} />
          {isSmallNav && <Text.LargeHeader fontWeight={100}>LOADING NAV. . .</Text.LargeHeader>}
        </Column>
      </InnerNavWrapper>
    </NavigationStepsWrapper>
  )
}
