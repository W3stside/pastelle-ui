import { DefaultTheme, FlattenSimpleInterpolation, css, CSSObject, SimpleInterpolation } from 'styled-components/macro'

import { THEME_COLOURS } from './styles'
import { Colors, ThemeModes } from './styled'
import { MediaWidths, MEDIA_WIDTHS } from './styles/mediaQueries'
import { hex } from 'wcag-contrast'
import { transparentize } from 'polished'
import { DDPXImageUrlMap, GenericImageSrcSet } from 'components/Carousel'

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
function _getLqIkUrl(
  urlAtWidth: DDPXImageUrlMap | undefined,
  {
    defaultUrl,
    dpi = '2x',
    transform = '?tr=pr-true,q-30'
  }: { defaultUrl: string; dpi?: keyof DDPXImageUrlMap; transform?: string }
) {
  const queryUrl = urlAtWidth?.[dpi] || defaultUrl
  const urlObj = urlAtWidth && queryUrl && new URL(queryUrl)

  if (!process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT || !urlObj) return null

  return process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT + urlObj?.pathname + transform
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
type SetCssBackgroundParams = {
  imageUrls?: GenericImageSrcSet[]
  backgroundAttributes?: string[]
  backgroundBlendMode?: string
  backgroundColor?: string
  ignoreQueriesWithFixedWidth?: MediaWidths
  dpiLevel?: '3x' | '2x' | '1x'
  skipIk?: boolean
}
export const setCssBackground = (
  theme: DefaultTheme,
  {
    imageUrls,
    backgroundColor = '',
    backgroundAttributes = ['cover no-repeat', 'cover no-repeat'],
    backgroundBlendMode = 'unset',
    ignoreQueriesWithFixedWidth = undefined,
    dpiLevel = '1x',
    skipIk = false
  }: SetCssBackgroundParams
) => {
  const getBackground = (width?: MediaWidths) => {
    return imageUrls
      ? imageUrls.map((urlSet, i, { length }) => {
          const [isFirst, isLast] = [!i, i === length - 1]

          const urlAtWidth = width && urlSet[width]
          const urlAtDpi = urlAtWidth?.[dpiLevel]

          const lqUrl = !skipIk && isFirst && _getLqIkUrl(urlAtWidth, { defaultUrl: urlSet.defaultUrl })

          const urlBuilt = `
            url(${lqUrl || urlAtDpi || urlSet.defaultUrl}) ${backgroundAttributes[i] || ''}${
            isLast ? ` ${backgroundColor}` : ','
          }
          `

          return urlBuilt
        })
      : backgroundColor
  }

  const backgroundMediaQueries = !!ignoreQueriesWithFixedWidth
    ? null
    : IMG_SET_SIZE_ENTRIES.map(([size, width]) => {
        const queryMethod = theme.mediaWidth?.[size as UpToSizeKey]
        if (!queryMethod) return null

        return queryMethod`background: ${getBackground(width)};`
      })

  return css`
    background: ${getBackground(ignoreQueriesWithFixedWidth)};
    ${backgroundMediaQueries}

    background-blend-mode: ${backgroundBlendMode};
  `
}

type BackgroundWithDPIProps = Partial<Omit<SetCssBackgroundParams, 'isLogo' | 'imageUrls'>> & {
  preset?: 'navbar' | 'header' | 'logo'
  modeColours?: [string, string]
}

export function setBestTextColour(bgColor = transparentize(0.3, getThemeColours(ThemeModes.DARK).bg1)) {
  return setBestContrastingColour({
    bgColour: bgColor,
    fgColour: OFF_WHITE,
    darkColour: BLACK,
    lightColour: OFF_WHITE
  })
}

export function setBackgroundWithDPI(
  theme: DefaultTheme,
  logoUrlSet: GenericImageSrcSet | SetCssBackgroundParams['imageUrls'],
  auxOptions: BackgroundWithDPIProps = {}
) {
  const imageUrls = logoUrlSet && (Array.isArray(logoUrlSet) ? logoUrlSet : [logoUrlSet, logoUrlSet])
  const presetOptions = _getPresetOptions(auxOptions, theme.mode)
  const options = Object.assign({ imageUrls }, presetOptions, auxOptions)
  return css`
    ${setCssBackground(theme, options)}

    @media (min-resolution: 2x) {
      ${setCssBackground(theme, { ...options, dpiLevel: '2x' })}
    }

    @media (min-resolution: 3x) {
      ${setCssBackground(theme, { ...options, dpiLevel: '3x' })}}
    }
  `
}

function _getPresetOptions(
  options: BackgroundWithDPIProps,
  mode: ThemeModes
): Partial<SetCssBackgroundParams> | undefined {
  const isLightMode = mode === ThemeModes.LIGHT
  switch (options.preset) {
    case 'header': {
      const [lmColour, dmColour] = options.modeColours || [OFF_WHITE, BLACK]
      return {
        backgroundColor: isLightMode ? lmColour : dmColour,
        backgroundAttributes: ['center / cover no-repeat', '0px 0px / cover no-repeat'],
        backgroundBlendMode: 'difference'
      }
    }
    case 'navbar': {
      const [lmColour, dmColour] = options.modeColours || [BLACK, BLACK]
      return {
        backgroundColor: isLightMode ? lmColour : dmColour,
        backgroundAttributes: ['center / cover no-repeat', '5px / cover repeat'],
        backgroundBlendMode: 'difference'
      }
    }
    case 'logo':
      return {
        ...options,
        backgroundAttributes: ['center/cover', 'center/cover no-repeat']
      }

    default: {
      const [lmColour, dmColour] = options.modeColours || [BLACK, BLACK]
      return {
        ...options,
        backgroundColor: isLightMode ? lmColour : dmColour
      }
    }
  }
}
