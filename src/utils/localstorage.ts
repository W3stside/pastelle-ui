import { ThemeModes } from '@/theme'

const IS_SERVER = typeof globalThis?.window == 'undefined'

function getAndParseLocalStorageItem(key: string) {
  const unparsedVal = !IS_SERVER ? localStorage.getItem(key) : null

  return unparsedVal ? JSON.parse(unparsedVal) : undefined
}

const USER_KEY = 'PASTELLE_SHOP_user'
function getLocalStorageThemeMode(): ThemeModes | undefined {
  return getAndParseLocalStorageItem(USER_KEY)?.theme?.mode
}

export function getLocalStorageThemeModeOrDefault(fallback: ThemeModes): ThemeModes {
  return getLocalStorageThemeMode() || fallback
}
