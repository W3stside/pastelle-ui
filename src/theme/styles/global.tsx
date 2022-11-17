import { createGlobalStyle } from 'styled-components/macro'
import { darken, transparentize } from 'polished'

import {
  setTextColour,
  setBgColour,
  fromExtraLarge,
  BLUE,
  setBestTextColour,
  getThemeColours,
  BLACK,
  setBackgroundWithDPI,
  OFF_WHITE
} from '../utils'
import FontStyles from './fonts'
import { setFlickerAnimation } from 'theme/styles/animations'
import { ThemeModes } from 'theme/styled'
import { useCurrentProductMedia } from 'state/collection/hooks'

const DEFAULT_BG = transparentize(0.3, getThemeColours(ThemeModes.DARK).bg1)

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
  
  input {
    border: none;
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
    color: ${BLUE};
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

export const ThemedGlobalStyle = createGlobalStyle<{
  currentMedia: ReturnType<typeof useCurrentProductMedia>
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
    background: ${({ theme }) => theme.currentMedia?.color || DEFAULT_BG};
  }

  header, footer {
    ${({ theme, currentMedia: { headerLogoSet, color = OFF_WHITE } }) =>
      setBackgroundWithDPI(theme, headerLogoSet, { preset: 'header', modeColours: [color, BLACK] })}
    

    #header-links-container {
      border-radius: 0.5rem;
      background-color: ${({ theme }) =>
        theme.currentMedia?.color ? darken(0.03, theme.currentMedia?.color) : DEFAULT_BG};
        > a {
          color: ${({ theme }) => setBestTextColour(theme.currentMedia?.color || DEFAULT_BG)};
        }
    }
  }

  
  nav {
    ${({ theme, currentMedia: { navLogoSet, color = DEFAULT_BG } }) =>
      setBackgroundWithDPI(theme, navLogoSet, {
        preset: 'navbar',
        modeColours: [color, BLACK],
        ignoreQueriesWithFixedWidth: 1440
      })}

    ${({ animation, animationDelay }) =>
      setFlickerAnimation({ state: !!animation, delay: animationDelay, duration: 4, count: 2 })}
  }
`

export function ThemedGlobalComponent() {
  const currentMedia = useCurrentProductMedia()
  return <ThemedGlobalStyle animation currentMedia={currentMedia} />
}
