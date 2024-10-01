import { Row } from '@past3lle/components'
import { useIsSmallMediaWidth, useOnResize } from '@past3lle/hooks'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Menu, X } from 'react-feather'

import { MobileNavOrb } from './styled'
import dynamic from 'next/dynamic'
import { NavigationFallback } from './NavigationFallback'

const InnerNavigation = dynamic(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "INNER_NAVIGATION" */ './InnerNav'),
  { ssr: false, loading: () => <NavigationFallback isSmallNav={false} isNavOpen={false} /> }
)

export type MobileNavProps = { menuSize?: number; bgColor?: string | null }

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
