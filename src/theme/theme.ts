import { createTemplateTheme } from '@past3lle/theme'

import { ThemeModes } from './types'

export const pastelleTheme = createTemplateTheme('PASTELLE')
export const getThemeColours = (mode: ThemeModes | 'DEFAULT') => pastelleTheme.modes[mode]
