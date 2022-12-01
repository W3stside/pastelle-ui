import { a } from '@react-spring/web'
import { Z_INDEXES } from 'constants/config'
import { transparentize } from 'polished'
import styled from 'styled-components/macro'
import { ThemeModes } from 'theme/styled'

export const AnimatedDivContainer = styled(a.div)<{
  $isVerticalScroll: boolean
  $withBoxShadow?: boolean
  $maxWidth?: string
  $maxHeight?: string
  $borderRadius?: string
}>`
  will-change: transform;
  position: absolute;
  cursor: pointer;
  border-radius: ${({ $borderRadius = '0.9rem' }) => $borderRadius};
  overflow: hidden;

  max-width: ${({ $maxWidth }) => ($maxWidth ? $maxWidth : 'none')};
  max-height: ${({ $maxHeight }) => ($maxHeight ? $maxHeight : 'none')};
  ${({ $isVerticalScroll }) => ($isVerticalScroll ? 'width: 100%;' : 'height: 100%;')}
  ${({ $withBoxShadow = true, theme }) =>
    $withBoxShadow && `box-shadow: 0px 0.1rem 2rem 0.9rem ${transparentize(0.5, theme.black)};`}

  &:hover {
    box-shadow: ${({ theme }) =>
      `0px 0px 3rem 1rem ${theme.mode === ThemeModes.DARK ? theme.blackOpaque2 : theme.offWhiteOpaque3}`};
  }

  transition: box-shadow 0.2s ease-in-out;
`

export const Scroller = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  cursor: pointer;
  z-index: ${Z_INDEXES.SCROLLER_DIV};

  touch-action: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`

export const ScrollerContainer = styled.div<{ $isVerticalScroll: boolean }>`
  ${({ $isVerticalScroll }) => ($isVerticalScroll ? 'height: 100%;' : 'width: 100%;')}
  position: relative;
  overflow: hidden;

  touch-action: none;
  transition: transform 350ms ease-in-out;
`
