import { createPast3lleTemplateTheme, getThemeColourByKeyCurried, getThemeColoursCurried } from '@past3lle/theme'

export const pastelleTheme = createPast3lleTemplateTheme('PASTELLE', {
  DARK: {
    modeFilter: '',
    modeLogoFilter: 'invert(1) saturate(1.4) hue-rotate(180deg) drop-shadow(0px 0px 12px rgba(0,0,0,1))',
  },
  LIGHT: {
    modeFilter: 'invert(1) brightness(0.8) hue-rotate(247deg) saturate(2)',
  },
})

export const getThemeColourByKey = getThemeColourByKeyCurried(pastelleTheme)
export const getThemeColours = getThemeColoursCurried(pastelleTheme)
