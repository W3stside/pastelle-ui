import { ThemeModes } from '@/theme'

function getAndParseLocalStorageItem(key: string) {
  const unparsedVal = localStorage.getItem(key)

  return unparsedVal ? JSON.parse(unparsedVal) : undefined
}

const USER_KEY = 'PASTELLE_SHOP_user'
function getLocalStorageThemeMode(): ThemeModes | undefined {
  return getAndParseLocalStorageItem(USER_KEY)?.theme?.mode
}

export function getLocalStorageThemeModeOrDefault(fallback: ThemeModes): ThemeModes {
  return getLocalStorageThemeMode() || fallback
}
