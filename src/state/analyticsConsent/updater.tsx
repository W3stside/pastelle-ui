import { useGoogleTagManagerConsent } from '@/analytics/google/hooks'

export function AnalyticsConsentUpdater() {
  useGoogleTagManagerConsent()
  return null
}
