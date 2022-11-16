import { DefaultTheme, FlattenSimpleInterpolation, css, CSSObject, SimpleInterpolation } from 'styled-components/macro'

import { THEME_COLOURS } from './styles'
import { Colors, ThemeModes } from './styled'
import { MEDIA_WIDTHS } from './styles/mediaQueries'
import { hex } from 'wcag-contrast'
import { transparentize } from 'polished'

export function getThemeColours(mode: ThemeModes): Colors {
  return THEME_COLOURS(mode)
}

export const WHITE = getThemeColours(ThemeModes.DARK).white
export const OFF_WHITE = getThemeColours(ThemeModes.DARK).offWhite
export const BLACK = getThemeColours(ThemeModes.DARK).black
export const CHARCOAL_BLACK = '#242424'
export const BLACK_TRANSPARENT = transparentize(0.15, BLACK)
export const BLUE = getThemeColours(ThemeModes.DARK).blue1
export const RED = getThemeColours(ThemeModes.DARK).red1

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

const whenMediaBetween = (size: keyof DefaultTheme['betweenMediaWidth']) => (
  first: CSSObject | TemplateStringsArray,
  ...interpolations: SimpleInterpolation[]
) => ({ theme }: { theme: DefaultTheme }) => theme.betweenMediaWidth[size]`${css(first, ...interpolations)}`

export const betweenExtraSmallAndSmall = whenMediaBetween('betweenExtraSmallAndSmall')
export const betweenSmallAndMedium = whenMediaBetween('betweenSmallAndMedium')
export const betweenMediumAndLarge = whenMediaBetween('betweenMediumAndLarge')
export const betweenLargeAndExtraLarge = whenMediaBetween('betweenLargeAndExtraLarge')

// big to small
// e.g { width: 500, ar: "3:2" }
const IMG_SET_SIZE_ENTRIES = Object.entries(MEDIA_WIDTHS).reverse()
// const LOGO_TRANSFORMS = [DEFAULT_IK_TRANSFORMS.HQ_LOGO, DEFAULT_IK_TRANSFORMS.LQ_LOGO]
// const IMAGE_TRANSFORMS = [DEFAULT_IK_TRANSFORMS.HQ_IMAGE, DEFAULT_IK_TRANSFORMS.LQ_IMAGE]
type SetCssBackgroundParams = {
  imageUrls?: (string | undefined)[]
  backgroundColor?: string
  backgroundAttributes: string[]
  backgroundBlendMode?: string
  skipMediaQueries?: boolean
}
type UpToSizeKey = keyof typeof MEDIA_WIDTHS

type CheckHexColourContrastParams = { bgColour: string; fgColour: string }
export function checkHexColourContrast({ bgColour, fgColour }: CheckHexColourContrastParams) {
  const contrast = hex(bgColour, fgColour)

  return contrast
}

type BestContrastingColourParams = CheckHexColourContrastParams & {
  lightColour: string
  darkColour: string
}
const CONTRAST_THRESHOLD = 10
export function setBestContrastingColour({ bgColour, fgColour, lightColour, darkColour }: BestContrastingColourParams) {
  const contrastLevel = checkHexColourContrast({
    bgColour,
    fgColour
  })

  return contrastLevel < CONTRAST_THRESHOLD ? lightColour : darkColour
}

/**
 *
 * @param theme
 * @param options
 * @example {
    isLogo?: boolean | undefined;
    imageUrls?: (string | undefined)[] | undefined;
    backgroundColor?: string | undefined;
    backgroundAttributes: string[];
    backgroundBlendMode?: string | undefined;
} 
 * @returns
 */
export const setCssBackground = (
  theme: DefaultTheme,
  {
    imageUrls,
    backgroundColor = '',
    backgroundAttributes = ['cover no-repeat', 'cover no-repeat'],
    backgroundBlendMode = 'unset',
    skipMediaQueries = false
  }: SetCssBackgroundParams
) => {
  const getBackground = (width?: number) => {
    return imageUrls
      ? imageUrls.map((url, i, { length }) => {
          const isLast = i === length - 1

          const urlBuilt = `${url}?tr=${width ? `w-${width}` : ''}`

          return `url(${urlBuilt}) ${backgroundAttributes[i]}${isLast ? ` ${backgroundColor}` : ','}`
        })
      : backgroundColor
  }

  const backgroundMediaQueries = skipMediaQueries
    ? null
    : IMG_SET_SIZE_ENTRIES.map(([size, width]) => {
        const queryMethod = theme.mediaWidth?.[size as UpToSizeKey]
        if (!queryMethod) return null

        return queryMethod`background: ${getBackground(width)};`
      })

  return css`
    background: ${getBackground()};
    ${backgroundMediaQueries}

    background-blend-mode: ${backgroundBlendMode};
  `
}

type NavHeaderCssBgProps = Partial<Omit<SetCssBackgroundParams, 'isLogo' | 'imageUrls' | 'backgroundColor'>>
export function setHeaderBackground(
  theme: DefaultTheme,
  headerLogo = theme.currentMedia?.headerLogo?.defaultUrl || '',
  [lightModeColor, darkModeColor] = [BLACK, BLACK],
  auxOptions: NavHeaderCssBgProps = {}
) {
  return setCssBackground(theme, {
    imageUrls: [headerLogo, headerLogo],
    backgroundAttributes: ['center / cover no-repeat', '0px 0px / cover no-repeat'],
    backgroundBlendMode: 'difference',
    backgroundColor: theme.mode === ThemeModes.DARK ? darkModeColor : lightModeColor,
    ...auxOptions
  })
}

export function setNavBackground(
  theme: DefaultTheme,
  navLogo = theme.currentMedia?.navLogo?.defaultUrl || '',
  [lightModeColor, darkModeColor] = [BLACK, BLACK],
  auxOptions: NavHeaderCssBgProps = {}
) {
  return setCssBackground(theme, {
    imageUrls: [navLogo, navLogo],
    backgroundAttributes: ['center / cover no-repeat', '5px / cover repeat'],
    backgroundBlendMode: 'difference',
    backgroundColor: theme.mode === ThemeModes.DARK ? darkModeColor : lightModeColor,
    ...auxOptions
  })
}

export function setBestTextColour(bgColor = transparentize(0.3, getThemeColours(ThemeModes.DARK).bg1)) {
  return setBestContrastingColour({
    bgColour: bgColor,
    fgColour: OFF_WHITE,
    darkColour: BLACK,
    lightColour: OFF_WHITE
  })
}
