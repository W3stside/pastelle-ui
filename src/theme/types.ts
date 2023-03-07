import { PastelleTheme } from '@past3lle/theme'

export enum ThemeModes {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends PastelleTheme {}
}
