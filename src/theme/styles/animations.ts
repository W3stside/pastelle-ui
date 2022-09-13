import { transparentize } from 'polished'
import {
  css,
  DefaultTheme,
  FlattenInterpolation,
  Keyframes,
  keyframes,
  ThemedStyledProps
} from 'styled-components/macro'

export const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const fadeInAnimation = keyframes`
  0% {
    filter: contrast(0) blur(100px);
  }
  100% {
    filter: contrast(1) blur(0px);
  }
`

export const saturateAnimation = keyframes`
  0% {
    filter: contrast(1.8) saturate(20) blur(5px);
  }
  10% {
    filter: contrast(1.8) saturate(1) blur(0.8px);
  }
`

export const rotateImgAnimation = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }

  100% {
    transform: perspective(1000px) rotateY(360deg);
  }
`

export const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const flickerAnimation = css<{ frameBgColor?: string }>`
  @keyframes flickerIn {
    0% {
      background-color: ${({ theme, frameBgColor = theme.bg1 }) => transparentize(1, frameBgColor)};
    }
    5% {
      background-color: ${({ theme, frameBgColor = theme.bg1 }) => transparentize(0, frameBgColor)};
    }
    8% {
      background-color: ${({ theme, frameBgColor = theme.bg1 }) => transparentize(1, frameBgColor)};
    }
    9% {
      background-color: ${({ theme, frameBgColor = theme.bg1 }) => transparentize(0, frameBgColor)};
    }
    12% {
      background-color: ${({ theme, frameBgColor = theme.bg1 }) => transparentize(1, frameBgColor)};
    }
    18% {
      background-color: ${({ theme, frameBgColor = theme.bg1 }) => transparentize(0, frameBgColor)};
    }
    24% {
      background-color: ${({ theme, frameBgColor = theme.bg1 }) => transparentize(0, frameBgColor)};
    }
    28% {
      background-color: ${({ theme, frameBgColor = theme.bg1 }) => transparentize(1, frameBgColor)};
    }
    42% {
      background-color: ${({ theme, frameBgColor = theme.bg1 }) => transparentize(0, frameBgColor)};
    }
  }
`

export const textShadowAnimation = css<{ itemColor: string }>`
  @keyframes textShadowAnimation {
    0% {
      text-shadow: 20px 2px 2px ${({ itemColor }) => itemColor};
      letter-spacing: 20px;
    }
    3% {
      text-shadow: 55px 2px 8px ${({ itemColor }) => itemColor};
    }
    5% {
      text-shadow: -22px 2px 2px pink;
    }
    7% {
      text-shadow: 47px 2px 8px ${({ itemColor }) => itemColor};
    }
    10% {
      text-shadow: 17px 2px 8px ${({ itemColor }) => itemColor};
    }
    47% {
      text-shadow: 10px 2px 2px ${({ itemColor }) => itemColor};
      letter-spacing: 7px;
    }
    48% {
      text-shadow: -20px 2px 1px pink;
    }
    49% {
      text-shadow: 20px 2px 2px ${({ itemColor }) => itemColor};
    }
    53% {
      text-shadow: 55px 2px 8px ${({ itemColor }) => itemColor};
    }
    55% {
      text-shadow: -32px 2px 2px purple;
    }
    57% {
      text-shadow: 47px 2px 7px lightgreen;
    }
    58% {
      text-shadow: -47px 2px 1px ${({ itemColor }) => itemColor};
    }
    60% {
      text-shadow: 20px 2px 2px ${({ itemColor }) => itemColor};
    }
    65% {
      text-shadow: 20px 2px 5px purple;
    }
  }
`

export const rotate360Animation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const strokeWidth = keyframes`
  0% {
    stroke-width: 10.8;
  }
  10% {
      stroke-width: 0;
  }

  20% {
    stroke-width: 10.8;
  }

  50% {
    stroke-width: 0;
  }
  60% {
    stroke-width: 10.8;
  }

  90% {
      stroke-width: 0;
  }
  100% {
      stroke-width: 30;
  }
`

type AnimationName = 'flickerIn' | 'textShadowAnimation'

interface BaseAnimationParams {
  name: AnimationName
  state?: boolean
  delay?: number
  count?: number | 'infinite'
  fillMode?: string
  duration: number
}

export function setAnimation<Props extends Record<any, any>>(
  animation: Keyframes,
  { state, delay, duration, count, fillMode }: Omit<BaseAnimationParams, 'name'>,
  customCss?: FlattenInterpolation<any>
): FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>> | undefined
export function setAnimation<Props extends Record<any, any>>(
  animation: FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>>,
  { name, state, delay, duration, count, fillMode }: BaseAnimationParams,
  customCss?: FlattenInterpolation<any>
): FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>> | undefined
export function setAnimation<Props extends Record<any, any>>(
  animation: Keyframes | FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>>,
  { name, state, delay, duration, count, fillMode }: Omit<BaseAnimationParams, 'name'> & { name?: string },
  customCss?: FlattenInterpolation<any>
): FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>> | undefined {
  if (!animation || state === false) return
  return css`
    // animation
    ${animation}
    ${name && `animation-name: ${name};`}
    animation-duration: ${duration}s;
    animation-iteration-count: ${count};
    ${delay && `animation-delay: ${delay}s;`}
    ${fillMode && `animation-fill-mode: ${fillMode};`}
    
    // whatever else CSS
    ${customCss}
  `
}

export const setFadeInAnimation = (params?: Partial<Pick<BaseAnimationParams, 'duration'>>) =>
  setAnimation(fadeInAnimation, { duration: params?.duration || 0.8 })

type FlickerAnimationParams = Omit<BaseAnimationParams, 'name'> & { state: boolean }
export const setFlickerAnimation = ({ state, delay, duration, count }: FlickerAnimationParams) =>
  setAnimation(flickerAnimation, { state, name: 'flickerIn', delay, duration, count })
