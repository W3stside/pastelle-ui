import { a } from '@react-spring/web'
import { transparentize } from 'polished'
import styled from 'styled-components/macro'
import { ThemeModes } from 'theme/styled'
export type TouchActionChoices =
  | 'auto'
  | 'none'
  | 'pan-x'
  | 'pan-left'
  | 'pan-right'
  | 'pan-y'
  | 'pan-up'
  | 'pan-down'
  | 'pinch-zoom'
  | 'manipulation'

export type TouchAction = TouchActionChoices[] | TouchActionChoices

export const AnimatedDivContainer = styled(a.div)<{
  $isVerticalScroll: boolean
  $withBoxShadow?: boolean
  $maxWidth?: string
  $maxHeight?: string
  $borderRadius?: string
  $touchAction: TouchAction
}>`
  touch-action: ${({ $touchAction }) =>
    typeof $touchAction === 'string' ? $touchAction : $touchAction?.join(' ') || 'none'};
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
    box-shadow: ${({ theme, $withBoxShadow = true }) =>
      $withBoxShadow &&
      `0px 0px 3rem 1rem ${theme.mode === ThemeModes.DARK ? theme.blackOpaque2 : theme.offWhiteOpaque3}`};
  }

  transition: box-shadow 0.2s ease-in-out;
`

export const ScrollerContainer = styled.div<{ $touchAction: TouchAction; $isVerticalScroll: boolean }>`
  touch-action: ${({ $touchAction }) => (typeof $touchAction === 'string' ? $touchAction : $touchAction.join(' '))};
  ${({ $isVerticalScroll }) => ($isVerticalScroll ? 'height: 100%;' : 'width: 100%;')}
  position: relative;
  overflow: hidden;
  transition: transform 350ms ease-in-out;
`
