import { Category, sendEvent } from '../index'

export function toggleDarkModeAnalytics(darkMode: boolean) {
  sendEvent('theme__toggle_mode', {
    category: Category.THEME,
    action: 'Toggle dark/light mode',
    label: `${darkMode ? 'Dark' : 'Light'} mode`,
  })
}
