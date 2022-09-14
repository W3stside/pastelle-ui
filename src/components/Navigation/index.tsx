import { Menu, X } from 'react-feather'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import LoadingRows from 'components/Loader/LoadingRows'
import { useCurrentCollection, useGetCurrentOnScreenCollectionProduct } from 'state/collection/hooks'
import { buildItemUrl } from 'utils/navigation'
import useOnResize from 'hooks/useOnResize'
import { MobileNavOrb, NavigationStepsWrapper, NavLinkWrapper, SideEffectNavLink, CollectionLabel } from './styled'
import { WHITE } from 'theme/utils'

export type MobileNavProps = { menuSize?: number; bgColor?: string }

export default function Navigation({
  navOrbProps,
  mobileHide
}: {
  navOrbProps?: MobileNavProps
  mobileHide?: boolean
}) {
  const navigate = useNavigate()
  // state collection data
  const collectionProductList = useCurrentCollection()
  const currentProduct = useGetCurrentOnScreenCollectionProduct()

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
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, product: ProductPageProps) => {
      e.preventDefault()
      isNavOpen && toggleNav()

      navigate(buildItemUrl(product.handle))
    },
    [navigate, isNavOpen, toggleNav]
  )

  // close open nav on resize
  useOnResize(() => setIsNavOpen(false), isNavOpen)

  return (
    <>
      <MobileNavOrb onClick={toggleNav} mobileHide={mobileHide} {...navOrbProps}>
        {NavToggleButton}
      </MobileNavOrb>
      <NavigationStepsWrapper isOpen={isNavOpen} width="9vw" minWidth="170px">
        <ItemSubHeader color={WHITE} margin="0">
          <strong>MERCH DROP #1</strong>
        </ItemSubHeader>

        <NavLinkWrapper>
          {collectionProductList ? (
            Object.values(collectionProductList).map(product => (
              <SideEffectNavLink key={product.id} onClick={e => handleNavMove(e, product)}>
                <ItemSubHeader padding="2px" margin="0" fontSize={isNavOpen ? '3.5rem' : '1.6rem'} color={WHITE}>
                  {<CollectionLabel active={product.id === currentProduct?.id}>{product.title}</CollectionLabel>}
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
