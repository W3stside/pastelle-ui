import { Menu, X } from 'react-feather'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import LoadingRows from 'components/Loader/LoadingRows'
import { useCurrentCollection, useGetCurrentOnScreenCollectionProduct } from 'state/collection/hooks'
import { buildItemUrl } from 'utils/navigation'
import useOnResize from 'hooks/useOnResize'
import { MobileNavOrb, NavigationStepsWrapper, InnerNavWrapper, SideEffectNavLink, CollectionLabel } from './styled'
import { WHITE } from 'theme/utils'
import { COLLECTION_PARAM_NAME } from 'constants/navigation'
import { Row } from 'components/Layout'
import ThemeToggleBar from 'components/ThemeToggler'

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
  const { collection, title } = useCurrentCollection()
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
      <NavigationStepsWrapper isOpen={isNavOpen} minWidth="9vw">
        <InnerNavWrapper>
          <ItemSubHeader color={WHITE} margin="0 0 1rem 0" padding={0}>
            <Row flexDirection={'row-reverse'} flexWrap={'wrap'} justifyContent="center" style={{ gap: '0.5rem' }}>
              <div style={{ fontWeight: 300, fontSize: '1.2rem' }}>{COLLECTION_PARAM_NAME}</div>
              <div>{title}</div>
            </Row>
          </ItemSubHeader>
          {collection ? (
            Object.values(collection).map(product => (
              <SideEffectNavLink key={product.id} onClick={e => handleNavMove(e, product)}>
                <ItemSubHeader
                  width={'100%'}
                  padding="2px"
                  margin="0"
                  fontSize={isNavOpen ? '3.5rem' : '1.6rem'}
                  color={WHITE}
                >
                  <CollectionLabel active={product.id === currentProduct?.id} bgColor={currentProduct?.bgColor}>
                    {product.title}
                  </CollectionLabel>
                </ItemSubHeader>
              </SideEffectNavLink>
            ))
          ) : (
            <LoadingRows rows={6} />
          )}
        </InnerNavWrapper>
        <InnerNavWrapper margin="auto auto 1rem auto" padding="0.8rem 1rem 1.5rem" alignItems={'center'}>
          <ItemSubHeader
            padding="0.2rem 0.2rem 1rem 0.2rem"
            margin="0"
            fontSize={isNavOpen ? '3.5rem' : '1.6rem'}
            color={WHITE}
          >
            <Row flexWrap="wrap" justifyContent="center" style={{ gap: '0.5rem' }}>
              THEME <div style={{ fontWeight: 300, fontSize: '1.2rem' }}>TOGGLER</div>
            </Row>
          </ItemSubHeader>
          <ThemeToggleBar themeToggleProps={{ width: '90%' }} />
        </InnerNavWrapper>
      </NavigationStepsWrapper>
    </>
  )
}
