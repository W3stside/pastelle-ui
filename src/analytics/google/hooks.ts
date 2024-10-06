import { useEffect } from 'react'
import { gtag, updateConsent } from '@/analytics/events/base'
import { useGoogleAnalyticsConsentSelector } from '@/state/analyticsConsent/hooks'
import { CookiePreferences } from '../events/types'

const IS_SERVER = typeof globalThis?.window == 'undefined'
export function useGoogleTagManagerConsentInit() {
  useEffect(() => {
    if (IS_SERVER) return
    const storage: CookiePreferences = JSON.parse(
      localStorage.getItem(process.env.NEXT_PUBLIC_PASTELLE_SHOP_cookies || '{}') ?? '{}',
    )
    window.dataLayer = window.dataLayer || []

    gtag('js', new Date())
    gtag('config', process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID)
    gtag('consent', 'default', {
      ad_storage: storage.advertising ? 'granted' : 'denied',
      ad_user_data: storage.adUserData ? 'granted' : 'denied',
      ad_personalization: storage.adPersonalisation ? 'granted' : 'denied',
      marketing_storage: storage.marketing ? 'granted' : 'denied',
      analytics_storage: 'granted',
    })
  }, [])
}

export function useGoogleTagManagerConsent() {
  const googleConsent = useGoogleAnalyticsConsentSelector()
  useEffect(() => {
    updateConsent(googleConsent, 'update')
  }, [googleConsent])
}
