import { devDebug, devError } from '@past3lle/utils'
import { useEffect } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'
import { initAnalytics } from '../utils'

const DEFAULT_COOKIE_CONSENT = { interacted: false, analytics: true, advertising: false, marketing: false }
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_DEV_GA == 'true' || process.env.NODE_ENV === 'production'

// tracks web vitals and pageviews
export function useAnalyticsReporter() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID || !process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID) {
    devError('MISSING GOOGLE GA and/or GOOGLE TAG MANAGER ID KEY! CHECK ENV')
  }

  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    if (!ANALYTICS_ENABLED) {
      devDebug('[useAnalyticsReporter] --> GOOGLE ANALYTICS DISABLED!')
      return
    }
  }, [pathname, search])

  useEffect(() => {
    if (!ANALYTICS_ENABLED) {
      devDebug('[useAnalyticsReporter] --> GOOGLE ANALYTICS DISABLED!')
      return
    }
    // Not in dev, init analytics
    const storageItem = localStorage.getItem(
      process.env.NEXT_PUBLIC_PASTELLE_COOKIE_SETTINGS || 'PASTELLE_SHOP_cookies',
    )
    const consent: typeof DEFAULT_COOKIE_CONSENT = storageItem ? JSON.parse(storageItem) : DEFAULT_COOKIE_CONSENT

    initAnalytics(consent)
  }, [])
}
