import { createGlobalStyle } from 'styled-components/macro'

export const CustomStaticGlobalCSSProvider = createGlobalStyle`
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
