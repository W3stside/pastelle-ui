import { CookiePreferences } from '../events/types'

const IS_SERVER = typeof globalThis?.window == 'undefined'
export function getDefaultConsentSettingsFromStorage() {
  if (IS_SERVER) return null
  const storage: CookiePreferences = JSON.parse(
    localStorage.getItem(process.env.NEXT_PUBLIC_PASTELLE_SHOP_cookies || '{}') ?? '{}'
  )

  return {
    ad_storage: storage.advertising ? 'granted' : 'denied',
    ad_user_data: storage.adUserData ? 'granted' : 'denied',
    ad_personalization: storage.adPersonalisation ? 'granted' : 'denied',
    marketing_storage: storage.marketing ? 'granted' : 'denied',
    analytics_storage: 'granted',
  }
}
