import { Menu, X } from 'react-feather'
import { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import LoadingRows from 'components/Loader/LoadingRows'
import { getThemeColours } from 'theme/utils'
import { ThemeModes } from 'theme/styled'
import { useCurrentCatalog, useGetCurrentOnScreenCatalogProduct } from 'state/catalog/hooks'
import { buildItemUrl } from 'utils/navigation'
import useOnResize from 'hooks/useOnResize'
import { MobileNavOrb, NavigationStepsWrapper, NavLinkWrapper, SideEffectNavLink, CatalogLabel } from './styled'

export type MobileNavProps = { menuSize?: number; bgColor?: string }

export default function Navigation({
  navOrbProps,
  mobileHide
}: {
  navOrbProps?: MobileNavProps
  mobileHide?: boolean
}) {
  const history = useHistory()
  // state catalog data
  const catalogProductList = useCurrentCatalog()
  const currentProduct = useGetCurrentOnScreenCatalogProduct()

  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = useCallback(() => {
    if (isNavOpen) {
      setIsNavOpen(false)
    } else {
      setIsNavOpen(true)
    }
  }, [isNavOpen])

  const NavToggleButton = useMemo(() => {
    return <div>{isNavOpen ? <X size={20} /> : <Menu size={navOrbProps?.menuSize || 20} />}</div>
  }, [isNavOpen, navOrbProps?.menuSize])

  const handleNavMove = useCallback(
    (_, product: ProductPageProps) => {
      isNavOpen && toggleNav()

      const url = buildItemUrl({ identifier: product.handle })
      history.push(url)
    },
    [history, isNavOpen, toggleNav]
  )

  // close open nav on resize
  useOnResize(() => setIsNavOpen(false), isNavOpen)

  return (
    <>
      <MobileNavOrb onClick={toggleNav} mobileHide={mobileHide} {...navOrbProps}>
        {NavToggleButton}
      </MobileNavOrb>
      <NavigationStepsWrapper isOpen={isNavOpen} width="9vw" minWidth="170px">
        <ItemSubHeader color={getThemeColours(ThemeModes.CHAMELEON).white} margin="0">
          <strong>MERCH DROP #1</strong>
        </ItemSubHeader>

        <NavLinkWrapper>
          {catalogProductList ? (
            Object.values(catalogProductList).map(product => (
              <SideEffectNavLink key={product.id} onClick={e => handleNavMove(e, product)}>
                <ItemSubHeader
                  padding="2px"
                  margin="0"
                  fontSize={isNavOpen ? '3.5rem' : '1.6rem'}
                  color={getThemeColours(ThemeModes.CHAMELEON).white}
                >
                  {<CatalogLabel active={product.id === currentProduct?.id}>{product.title}</CatalogLabel>}
                </ItemSubHeader>
              </SideEffectNavLink>
            ))
          ) : (
            <LoadingRows rows={6} />
          )}
        </NavLinkWrapper>
      </NavigationStepsWrapper>
    </>
  )
}
