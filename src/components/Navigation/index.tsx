import styled from 'styled-components/macro'
import Button from 'components/Button'
import { Menu, X } from 'react-feather'
import { useCallback, useMemo, useState } from 'react'
import { Column, Row } from 'components/Layout'
import ThemeToggleBar from 'components/ThemeToggler'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import { getThemeColours } from 'theme/utils'
import { ThemeModes } from 'theme/styled'
import { useCurrentCollectionProducts } from 'pages/Catalog/hooks'
import { useGetCurrentOnScreenItem } from 'state/catalog/hooks'
import { buildItemUrl } from 'utils/navigation'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import { useHistory } from 'react-router-dom'
import useOnResize from 'hooks/useOnResize'

const NavigationStepsWrapper = styled.nav<{ isOpen?: boolean; width?: string; minWidth?: string }>`
  width: ${({ width = 'auto' }) => width};
  ${({ minWidth }) => minWidth && `min-width: ${minWidth};`}
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: start;

  text-align: left;

  padding: 10px;
  gap: 0px;

  // all links in nav
  > a {
    font-size: 1.6rem;
  }

  z-index: 200;

  ${({ theme, isOpen }) => theme.mediaWidth.upToMedium`
    display: ${isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: ${isOpen ? '100%' : 0};
    opacity: ${isOpen ? 1 : 0};
  `}
`
type MobileNavProps = { menuSize?: number; bgColor?: string }
export const MobileNavOrb = styled(Button)<MobileNavProps & { mobileHide?: boolean }>`
  display: none;
  background: ${({ theme, bgColor = theme.red2 }) => bgColor};
  color: ${({ theme }) => theme.white};
  cursor: pointer;
  z-index: 210;
  gap: 5px;

  > ${Row} {
    gap: 5px;
    > svg {
      &:hover {
        transform: rotateZ(180deg);
      }
      transition: transform 0.3s ease-in-out;
    }
  }
  ${({ theme, mobileHide }) => theme.mediaWidth.upToMedium`
    display: ${mobileHide ? 'none' : 'flex'};
    position: relative;
    bottom: 0; right: 0; margin: 10px;  
    justify-content: center;
    align-items: center;

    margin-left: auto;
  `};
`

const ThemeColumn = styled(Column)`
  margin: auto auto 0 0;
`

const CatalogLabel = styled.span<{ active: boolean }>`
  font-weight: ${({ active }) => (active ? 700 : 400)};
  ${({ active }) =>
    active &&
    `
      text-decoration: line-through;
      text-decoration-thickness: from-font;
      font-size: larger;
      // filter: blur(1.2px);
    `}
`

const SideEffectNavLink = styled.span`
  cursor: pointer;
`

const NavLinkWrapper = styled.div`
  background: #1d1d1d;
  padding: 10px;
`

export default function Navigation({
  navOrbProps,
  mobileHide
}: {
  navOrbProps?: MobileNavProps
  mobileHide?: boolean
}) {
  const { productsList: products } = useCurrentCollectionProducts()
  const currentProduct = useGetCurrentOnScreenItem()
  const history = useHistory()

  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = useCallback(() => {
    if (isNavOpen) {
      setIsNavOpen(false)
    } else {
      setIsNavOpen(true)
    }
  }, [isNavOpen])

  const NavToggleButton = useMemo(() => {
    return isNavOpen ? <X size={20} /> : <Menu size={navOrbProps?.menuSize || 20} />
  }, [isNavOpen, navOrbProps?.menuSize])

  const handleNavMove = useCallback(
    (_, product: ProductPageProps) => {
      isNavOpen && toggleNav()

      const url = buildItemUrl({ identifier: product.title })
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
        <ItemSubHeader color={getThemeColours(ThemeModes.CHAMELEON).white}>
          <strong>{'MERCH'}</strong>
        </ItemSubHeader>

        <NavLinkWrapper>
          {products.map(product => (
            <SideEffectNavLink key={product.id} onClick={e => handleNavMove(e, product)}>
              <ItemSubHeader
                padding="2px"
                fontSize={isNavOpen ? '3.5rem' : '1.6rem'}
                color={getThemeColours(ThemeModes.CHAMELEON).white}
              >
                <CatalogLabel active={product.id === currentProduct?.id}>{product.title}</CatalogLabel>
              </ItemSubHeader>
            </SideEffectNavLink>
          ))}
        </NavLinkWrapper>

        {/* THEME TOGGLER */}
        <ThemeColumn>
          <ThemeToggleBar />
        </ThemeColumn>
      </NavigationStepsWrapper>
    </>
  )
}
