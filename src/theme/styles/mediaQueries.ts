import { ThemedCssFunction, DefaultTheme, CSSObject, FlattenSimpleInterpolation, css } from 'styled-components/macro'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280
}

const FROM_MEDIA_WIDTHS = {
  fromExtraSmall: MEDIA_WIDTHS.upToExtraSmall,
  fromSmall: MEDIA_WIDTHS.upToSmall,
  fromMedium: MEDIA_WIDTHS.upToMedium,
  fromLarge: MEDIA_WIDTHS.upToLarge
}

type MediaWidthKeys = keyof typeof MEDIA_WIDTHS
type FromMediaWidthKeys = keyof typeof FROM_MEDIA_WIDTHS

type MediaWidth = {
  [key in MediaWidthKeys]: ThemedCssFunction<DefaultTheme>
}
type FromMediaWidth = {
  [key in FromMediaWidthKeys]: ThemedCssFunction<DefaultTheme>
}

export const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce<MediaWidth>((accumulator, size: unknown) => {
  ;(accumulator[size as MediaWidthKeys] as unknown) = (
    a: CSSObject,
    b: CSSObject,
    c: CSSObject
  ): ThemedCssFunction<DefaultTheme> | FlattenSimpleInterpolation => css`
    @media (max-width: ${MEDIA_WIDTHS[size as MediaWidthKeys]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {} as MediaWidth)

export const fromMediaWidthTemplates = Object.keys(FROM_MEDIA_WIDTHS).reduce<FromMediaWidth>(
  (accumulator, size: unknown) => {
    ;(accumulator[size as FromMediaWidthKeys] as unknown) = (
      a: CSSObject,
      b: CSSObject,
      c: CSSObject
    ): ThemedCssFunction<DefaultTheme> | FlattenSimpleInterpolation => css`
      @media (min-width: ${FROM_MEDIA_WIDTHS[size as FromMediaWidthKeys]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {} as FromMediaWidth
)
