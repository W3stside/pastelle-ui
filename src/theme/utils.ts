import { DefaultTheme, FlattenSimpleInterpolation, css, CSSObject, SimpleInterpolation } from 'styled-components/macro'

import { LIGHT_COLOURS, DARK_COLOURS, DEFAULT_COLOURS, VAMPIRE_COLOURS, CHAMELEON_COLOURS } from './styles'
import { ThemeModes, Colors } from './styled'

export function getThemeColours(colourTheme: ThemeModes): Colors {
  let THEME_COLOURS = LIGHT_COLOURS

  switch (colourTheme) {
    case ThemeModes.LIGHT:
      THEME_COLOURS = LIGHT_COLOURS
      break
    case ThemeModes.DARK:
      THEME_COLOURS = DARK_COLOURS
      break
    case ThemeModes.VAMPIRE:
      THEME_COLOURS = VAMPIRE_COLOURS
      break
    case ThemeModes.CHAMELEON:
      THEME_COLOURS = CHAMELEON_COLOURS
      break
  }
  return {
    ...DEFAULT_COLOURS,
    ...THEME_COLOURS
  }
}

export const WHITE = getThemeColours(ThemeModes.CHAMELEON).white
export const OFF_WHITE = getThemeColours(ThemeModes.CHAMELEON).offWhite
export const BLACK = getThemeColours(ThemeModes.CHAMELEON).black
export const BLUE = getThemeColours(ThemeModes.CHAMELEON).blue1
export const RED = getThemeColours(ThemeModes.CHAMELEON).red1

interface ThemeProps {
  theme: DefaultTheme
}

export const setBgColour = (themeColour: keyof Colors) => ({ theme }: ThemeProps): FlattenSimpleInterpolation =>
  css`
    background-color: ${theme[themeColour]};
  `

export const setTextColour = (themeColour: keyof Colors) => ({ theme }: ThemeProps): FlattenSimpleInterpolation =>
  css`
    color: ${theme[themeColour]};
  `

const whenMediaSmallerThan = (size: keyof DefaultTheme['mediaWidth']) => (
  first: CSSObject | TemplateStringsArray,
  ...interpolations: SimpleInterpolation[]
) => ({ theme }: { theme: DefaultTheme }) => theme.mediaWidth[size]`${css(first, ...interpolations)}`

export const upToExtraSmall = whenMediaSmallerThan('upToExtraSmall')
export const upToSmall = whenMediaSmallerThan('upToSmall')
export const upToMedium = whenMediaSmallerThan('upToMedium')
export const upToLarge = whenMediaSmallerThan('upToLarge')
export const upToExtraLarge = whenMediaSmallerThan('upToExtraLarge')

const whenMediaLargerThan = (size: keyof DefaultTheme['fromMediaWidth']) => (
  first: CSSObject | TemplateStringsArray,
  ...interpolations: SimpleInterpolation[]
) => ({ theme }: { theme: DefaultTheme }) => theme.fromMediaWidth[size]`${css(first, ...interpolations)}`

export const fromExtraSmall = whenMediaLargerThan('fromExtraSmall')
export const fromSmall = whenMediaLargerThan('fromSmall')
export const fromMedium = whenMediaLargerThan('fromMedium')
export const fromLarge = whenMediaLargerThan('fromLarge')
export const fromExtraLarge = whenMediaLargerThan('fromExtraLarge')
