import { useGtagConfigAndConsent } from '@/analytics/google/hooks'

export function AnalyticsConsentUpdater() {
  // Gtag.js consent
  useGtagConfigAndConsent()
  return null
}
