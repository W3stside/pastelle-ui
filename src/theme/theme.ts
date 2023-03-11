import { createPast3lleTemplateTheme, getThemeColourByKeyCurried, getThemeColoursCurried } from '@past3lle/theme'

export const pastelleTheme = createPast3lleTemplateTheme('PASTELLE')

export const getThemeColourByKey = getThemeColourByKeyCurried(pastelleTheme)
export const getThemeColours = getThemeColoursCurried(pastelleTheme)
