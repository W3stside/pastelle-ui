import { createGlobalStyle, css } from 'styled-components/macro'
import { darken, transparentize } from 'polished'

import { getThemeColours, setTextColour, setBgColour, fromExtraLarge } from '../utils'
import { ThemeModes } from '../styled'
import FontStyles from './fonts'
import { useAppColourTheme } from 'state/user/hooks'
import { useMemo } from 'react'
import { useGetCurrentOnScreenCatalogProduct } from 'state/catalog/hooks'
import { DEFAULT_IK_TRANSFORMS } from 'constants/config'

export { FontStyles }

export const TopGlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    
    &::-webkit-scrollbar {
      // TODO: marked to find easier
      // hide scrollbar
      width: 0px;
      border-radius: 16px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      background: transparent;
    }
  
    &::-webkit-scrollbar-thumb {
      background: ghostwhite;
      border-radius: 16px;
      background-clip: padding-box;
    }

  }

  html,
  input,
  textarea,
  button {
    font-family: 'Roboto', 'Inter', sans-serif;
    font-display: fallback;
  }
  
  @supports (font-variation-settings: normal) {
    html,
    input,
    textarea,
    button {
      font-family: 'Roboto', 'Inter var', sans-serif;
    }
  }
  
  html,
  body {
    font-size: 10px;
    margin: 0;
    padding: 0;
  }

  
  html {
    font-variant: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  }

  body {
    // BG
    background-position: 0 -30vh;
    background-repeat: no-repeat;
  }

  header {
    grid-area: header;
  }

  footer {
    grid-area: footer;
  }

  nav {
    grid-area: nav;
  }

  article {
    grid-area: main;
  }

  nav, article {
    overflow-y: auto;
  }

  a {
    color: ${getThemeColours(ThemeModes.LIGHT).blue1};
  }
  
  button {
    user-select: none;
  }

  body > div#root {
    height: 100vh;
    display: grid;
    grid-template-areas:  'header header'
                          'nav main'
                          'footer footer';
    grid-template-columns: minmax(auto, max-content) 5fr;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
  }

  select {
    // A reset of styles, including removing the default dropdown arrow
    appearance: none;
    // Additional resets for further consistency
    background-color: transparent;
    border: none;
    padding: 0 1em 0 0;
    margin: 0;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
  }
`

export const flickerAnimation = css<{ frameBgColor?: string }>`
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

export const ThemedGlobalStyle = createGlobalStyle<{
  frameBgColor?: string
  headerLogo?: string
  navLogo?: string
  animation?: boolean
  animationDelay?: number
}>`
  * {
    &::-webkit-scrollbar-thumb {
      background: transparent;
    }
  }

  html {
    ${setTextColour('text1')}
    ${setBgColour('bg2')}
  }

  body {
    background-image: ${({ theme }): string => `
      radial-gradient(
        50% 50% at 50% 50%,
        ${transparentize(0.9, theme.primary1)} 0%,
        ${transparentize(1, theme.bg1)} 100%
      );`}

    transition: background-color, background-image, color 0.3s ease-in-out;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      > div#root {
        grid-template-areas:  'header header'
                              'main main'
                              'footer footer';
                              
        > nav {
          display: none;
        }
      }
    `}
  }

  html,body {
    ${fromExtraLarge`
      font-size: 0.5vw;
    `}
  }

  header, nav, footer {
    background: ${({ theme, frameBgColor = transparentize(0.3, theme.bg1) }) => frameBgColor};
  }

  header, footer {
    background: ${({ headerLogo, theme, frameBgColor = transparentize(0.3, theme.bg1) }) =>
      headerLogo
        ? `url(${headerLogo}?tr=${DEFAULT_IK_TRANSFORMS.HQ_LOGO}) center no-repeat, url(${headerLogo}?tr=${DEFAULT_IK_TRANSFORMS.LQ_LOGO}) 0px 0px no-repeat`
        : frameBgColor};
      
    background-color: ${({ theme, frameBgColor = transparentize(0.3, theme.bg1) }) => frameBgColor};
    background-size: cover;
    background-blend-mode: difference;

    #header-links-container {
      background-color: ${({ frameBgColor, theme }) =>
        frameBgColor ? darken(0.05, frameBgColor) : transparentize(0.3, theme.bg1)};
    }
  }

  nav {
    background: ${({ navLogo, theme, frameBgColor = transparentize(0.3, theme.bg1) }) =>
      navLogo
        ? `url(${navLogo}?tr=${DEFAULT_IK_TRANSFORMS.HQ_LOGO}) center no-repeat, url(${navLogo}?tr=${DEFAULT_IK_TRANSFORMS.LQ_LOGO}) 5px repeat`
        : frameBgColor};
    background-size: cover;
    background-blend-mode: difference;
    background-color: ${({ theme, frameBgColor = transparentize(0.3, theme.bg1) }) => frameBgColor};

    ${({ animation = true }) => animation && flickerAnimation}
    ${({ animation = true, animationDelay = 3 }) =>
      animation &&
      `
        animation-name: flickerIn;
        animation-duration: 4s;
        animation-iteration-count: 2;
        ${animationDelay && `animation-delay: ${animationDelay}s;`}
    `}
`

export const ThemedGlobalComponent = () => {
  const theme = useAppColourTheme()

  const currentItem = useGetCurrentOnScreenCatalogProduct()

  const { itemColor, navLogo, headerLogo, showAnimation } = useMemo(
    () => ({
      itemColor: theme.mode === ThemeModes.CHAMELEON ? currentItem?.color : undefined,
      navLogo: theme.mode === ThemeModes.CHAMELEON ? currentItem?.navLogo : undefined,
      headerLogo: theme.mode === ThemeModes.CHAMELEON ? currentItem?.headerLogo : undefined,
      showAnimation: theme.mode === ThemeModes.CHAMELEON
    }),
    [currentItem?.headerLogo, currentItem?.color, currentItem?.navLogo, theme.mode]
  )

  return (
    <ThemedGlobalStyle frameBgColor={itemColor} headerLogo={headerLogo} navLogo={navLogo} animation={showAnimation} />
  )
}
