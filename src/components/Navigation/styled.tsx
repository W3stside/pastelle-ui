import styled from 'styled-components/macro'
import Button from 'components/Button'
import { MobileNavProps } from '.'
import { Z_INDEXES } from 'constants/config'
import { Column, Row } from 'components/Layout'
import { BLACK, setBackgroundWithDPI, setBestTextColour, upToExtraSmall, upToMedium } from 'theme/utils'
import { setFlickerAnimation } from 'theme/styles/animations'
import { GenericImageSrcSet } from 'shopify/graphql/types'

export const NavigationStepsWrapper = styled.nav<{
  isOpen?: boolean
  width?: string
  minWidth?: string
  currentMedia: { navLogoSet?: GenericImageSrcSet; color?: string }
}>`
  position: relative;
  overflow: hidden;
  width: ${({ width = 'auto' }) => width};
  ${({ minWidth }) => minWidth && `min-width: ${minWidth};`}
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: start;

  text-align: left;

  gap: 0px;

  ${({ theme, currentMedia: { navLogoSet, color = BLACK } }) =>
    setBackgroundWithDPI(theme, navLogoSet, {
      preset: 'navbar',
      modeColours: [color, BLACK]
    })}

  z-index: 1;

  > a {
    font-size: 1.6rem;
  }

  z-index: ${Z_INDEXES.NAV_MENU};

  ${setFlickerAnimation({ state: true, duration: 4, count: 2 })}

  ${({ isOpen }) => upToMedium`
    display: ${isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 0; left: 0; bottom: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding-bottom: 7rem;
    width: 100%;
    
    // theme toggler
    // TODO: change when you don't want CSS BGs for logos (e.g use component)
    > ${InnerNavWrapper}:nth-child(2) {
      display: none;
    }
    
    width: ${isOpen ? '100%' : '0px'};
    opacity: ${isOpen ? '1' : '0'};
  `}

  ${upToExtraSmall`
    bottom: 6rem;
  `}
`

export const MobileNavOrb = styled(Button)<MobileNavProps & { mobileHide?: boolean }>`
  display: none;
  background: ${({ theme, bgColor = theme.red2 }) => bgColor};
  color: ${({ theme }) => theme.white};
  cursor: pointer;
  z-index: ${Z_INDEXES.NAV_MENU + 1};
  gap: 5px;

  > div {
    display: flex;
    padding: 1rem;
    background: #000;

    border-radius: ${({ theme }) => theme.buttons.borderRadius};

    > svg {
      &:hover {
        transform: rotateZ(180deg);
      }
      transition: transform 0.5s ease-in-out;
    }
  }

  ${({ theme, mobileHide }) => theme.mediaWidth.upToMedium`
    display: ${mobileHide ? 'none' : 'flex'};
    position: relative;
    bottom: 0; right: 0;
    justify-content: center;
    align-items: center;
  `};
`

export const CollectionLabel = styled(Row)<{ active: boolean; bgColor?: string }>`
  font-weight: ${({ active }) => (active ? 700 : 300)};
  padding: 0 1rem;
  gap: 1rem;

  ${({ active, bgColor = 'transparent' }) =>
    active &&
    `
      color: ${setBestTextColour(bgColor)};
      background-color: ${bgColor};
      text-decoration: line-through;
      text-decoration-thickness: from-font;
      font-size: larger;
      width: 100%;
    `}
`

export const SideEffectNavLink = styled.span`
  cursor: pointer;
`

// #1d1d1d
export const InnerNavWrapper = styled(Column)<{ bgColor?: string }>`
  width: 100%;
  background-color: ${({ theme, bgColor = theme.blackOpaque2 }) => bgColor};
  padding: 1rem;
`
