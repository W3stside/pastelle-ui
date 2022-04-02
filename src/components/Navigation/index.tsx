import styled from 'styled-components/macro'
import Button from 'components/Button'
import { StyledNavLink } from 'components/Header/styleds'
import { Menu, X } from 'react-feather'
import { useMemo, useState } from 'react'
import { Column, Row } from 'components/Layout'
import ThemeToggleBar from 'components/ThemeToggler'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import { getThemeColours } from 'theme/utils'
import { ThemeModes } from 'theme/styled'
import { CURRENT_YEAR } from 'constants/config'
import { useCatalogItemFromURL } from 'pages/Catalog/hooks'

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
    font-size: 16px;
  }

  z-index: 200;

  ${({ theme, isOpen }) => theme.mediaWidth.upToExtraSmall`
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

export const MobileNavOrb = styled(Button)<{ bgColor?: string }>`
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
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    position: relative;
    bottom: 0; right: 0; margin: 10px;  
    display: flex;
    justify-content: center;
    align-items: center;
  `};
`

const ThemeColumn = styled(Column)`
  margin: auto auto 0 0;
`

const CatalogLabel = styled.span<{ active: boolean }>`
  font-weight: ${({ active }) => (active ? 700 : 400)};
  ${({ active }) =>
    !active &&
    `
      text-decoration: line-through;
      filter: blur(1.2px);
    `}
`

export default function Navigation({ navOrbProps }: any) {
  const { seasonList, currentItem } = useCatalogItemFromURL()
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = () => {
    if (isNavOpen) {
      setIsNavOpen(false)
    } else {
      setIsNavOpen(true)
    }
  }

  const NavToggleButton = useMemo(() => {
    return isNavOpen ? <X size={20} /> : <Menu size={navOrbProps?.menuSize || 20} />
  }, [isNavOpen, navOrbProps?.menuSize])

  return (
    <>
      <MobileNavOrb onClick={toggleNav} {...navOrbProps}>
        {NavToggleButton}
      </MobileNavOrb>
      <NavigationStepsWrapper isOpen={isNavOpen} width="9vw" minWidth="170px">
        <ItemSubHeader color={getThemeColours(ThemeModes.CHAMELEON).white}>
          <strong>{'// MERCH'}</strong>
        </ItemSubHeader>

        {seasonList.map(catalogItem => (
          <StyledNavLink key={catalogItem.key} to={`/catalog/${CURRENT_YEAR}/${catalogItem}`}>
            <ItemSubHeader padding="2px" color={getThemeColours(ThemeModes.CHAMELEON).white}>
              <CatalogLabel active={catalogItem.key === currentItem?.key}>{catalogItem.itemHeader}</CatalogLabel>
            </ItemSubHeader>
          </StyledNavLink>
        ))}

        {/* THEME TOGGLER */}
        <ThemeColumn>
          <ThemeToggleBar />
        </ThemeColumn>
      </NavigationStepsWrapper>
    </>
  )
}
