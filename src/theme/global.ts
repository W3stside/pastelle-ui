import { createGlobalStyle } from 'styled-components/macro'

export const CustomStaticGlobalCSSProvider = createGlobalStyle`
  html, body {
    font-family: 'Roboto Flex', system-ui;
    font-variation-settings: 'wght' 300;
  }
  
  body {
    overflow: hidden;
    
    > div#root {
      height: 100vh;

      a {
        color: ${(props) => props.theme.purple};
      }
    }
  }
`

export const CustomThemedGlobalCSSProvider = createGlobalStyle`
  body {
    color: ${({ theme }) => theme.white};
  }
`
