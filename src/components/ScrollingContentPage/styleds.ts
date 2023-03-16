import { a } from '@react-spring/web'
import { AxisDirection } from 'hooks/useScrollAnimation'
import { transparentize } from 'polished'
import styled from 'styled-components/macro'

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
  $axis: AxisDirection
  $borderRadius?: string
  $fillContainer?: boolean
  $maxHeight?: string
  $maxWidth?: string
  $touchAction: TouchAction
  $withBoxShadow?: boolean
}>`
  touch-action: ${({ $touchAction }) => (typeof $touchAction === 'string' ? $touchAction : $touchAction?.join(' '))};
  will-change: transform;
  position: absolute;
  cursor: pointer;
  border-radius: ${({ $borderRadius = '0.9rem' }) => $borderRadius};
  overflow: hidden;

  width: 100%;
  height: 100%;
  max-width: ${({ $maxWidth = 'none' }) => $maxWidth};
  max-height: ${({ $maxHeight = 'none' }) => $maxHeight};

  ${({ $axis, $fillContainer }) =>
    $fillContainer
      ? `
    width: 100%;
    height: 100%;
    `
      : $axis === 'y'
      ? 'width: 100%;'
      : 'height: 100%;'}

  ${({ $withBoxShadow = true, theme }) =>
    $withBoxShadow && `box-shadow: 0px 0.1rem 2rem 0.9rem ${transparentize(0.5, theme.black)};`}

  &:hover {
    box-shadow: ${({ theme, $withBoxShadow = true }) =>
      $withBoxShadow &&
      `0px 0px 3rem 1rem ${theme.mode === 'DARK' ? theme.blackOpaqueMore : theme.offwhiteOpaqueMost}`};
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
