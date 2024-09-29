import { transparentize } from 'polished'
import { css } from 'styled-components'

export const simmerAnimationCallback = (color = '#ffc1ff') => css`
  @keyframes simmer {
    0% {
      background-color: ${transparentize(1, color)};
    }
    50% {
      background-color: ${transparentize(0, color)};
    }
    100% {
      background-color: ${transparentize(1, color)};
    }
  }
`
