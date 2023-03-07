import { createTemplateTheme, getThemeColourByKeyCurried, getThemeColoursCurried } from '@past3lle/theme'

export const pastelleTheme = createTemplateTheme('PASTELLE')

export const getThemeColourByKey = getThemeColourByKeyCurried(pastelleTheme)
export const getThemeColours = getThemeColoursCurried(pastelleTheme)
