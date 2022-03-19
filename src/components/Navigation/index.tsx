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
import { CURRENT_SEASON, CURRENT_YEAR, SEASONS } from 'constants/config'

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

const MobileNavOrb = styled(Button)`
  display: none;
  background: ${({ theme }) => theme.red2};
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
    position: fixed;
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

export default function Navigation() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = () => {
    if (isNavOpen) {
      setIsNavOpen(false)
    } else {
      setIsNavOpen(true)
    }
  }

  const NavToggleButton = useMemo(() => {
    return isNavOpen ? (
      <X size={20} />
    ) : (
      <Row>
        CATEGORIES <Menu size={20} />
      </Row>
    )
  }, [isNavOpen])

  return (
    <>
      <MobileNavOrb onClick={toggleNav}>{NavToggleButton}</MobileNavOrb>
      <NavigationStepsWrapper isOpen={isNavOpen} minWidth="150px">
        <ItemSubHeader color={getThemeColours(ThemeModes.CHAMELEON).white}>
          <strong>{'// CATALOGS'}</strong>
        </ItemSubHeader>

        {SEASONS.map(season => (
          <StyledNavLink key={season} to={`/catalog/${CURRENT_YEAR}/${season}`}>
            <ItemSubHeader padding="2px" color={getThemeColours(ThemeModes.CHAMELEON).white}>
              <CatalogLabel active={season === CURRENT_SEASON}>
                {season} - {CURRENT_YEAR}
              </CatalogLabel>
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
