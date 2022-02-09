import styled from 'styled-components/macro'
import Button from 'components/Button'
import { StyledNavLink } from 'components/Header/styleds'
import { Menu, X } from 'react-feather'
import { useMemo, useState } from 'react'
import { Row } from 'components/Layout'

const NavigationStepsWrapper = styled.nav<{ isOpen?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: start;

  text-align: left;

  padding: 10px;
  gap: 10px;

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
      <NavigationStepsWrapper isOpen={isNavOpen}>
        <StyledNavLink to="/#">{'// LONGSLEEVE'}</StyledNavLink>
        <StyledNavLink to="/#">{'// SHORTSLEEVE'}</StyledNavLink>
        <StyledNavLink to="/#">{'// HOODIES'}</StyledNavLink>
      </NavigationStepsWrapper>
    </>
  )
}
