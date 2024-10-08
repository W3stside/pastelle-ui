import { useEffect } from 'react'
import { gtag, updateConsent } from '@/analytics/events/base'
import { useDispatchGoogleAnalyticsConfigured, useGoogleAnalyticsConsentSelector } from '@/state/analyticsConsent/hooks'
import { getDefaultConsentSettingsFromStorage } from './utils'

export function useGtagConfigAndConsent() {
  const googleConsent = useGoogleAnalyticsConsentSelector()
  const setGoogleAnalyticsConfigured = useDispatchGoogleAnalyticsConfigured()
  // Async gtag.js setup
  // the reason we do this here and not in a script directly at load is because
  // with nextjs static export and CSP requirements, we need to use edge-functions
  // from netlify to intercept the CSP headers and manually set nonces on script tags
  // thus negating the ability to sync load scripts
  useEffect(() => {
    if (googleConsent.configured) return

    const defaultConsent = getDefaultConsentSettingsFromStorage()
    gtag('js', new Date())
    gtag('config', process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID)
    gtag('consent', 'default', defaultConsent)

    setGoogleAnalyticsConfigured(true)
  }, [googleConsent.configured, setGoogleAnalyticsConfigured])

  useEffect(() => {
    updateConsent(googleConsent.consent, googleConsent.configured ? 'update' : 'default')
  }, [googleConsent.consent, googleConsent.configured])
}
