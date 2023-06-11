import { devDebug, isMobile } from '@past3lle/utils'
import { Dimensions } from 'analytics/GoogleAnalytics4Provider'
import { useEffect } from 'react'
import TagManager from 'react-gtm-module'
import { useLocation } from 'react-router-dom'
import { Metric, getCLS, getFCP, getFID, getLCP } from 'web-vitals'

import { GOOGLE_ANALYTICS_CLIENT_ID_STORAGE_KEY, GOOGLE_ANALYTICS_ID, googleAnalytics } from '..'

export function sendTiming(timingCategory: any, timingVar: any, timingValue: any, timingLabel: any) {
  return googleAnalytics.gaCommandSendTiming(timingCategory, timingVar, timingValue, timingLabel)
}

function sendWebVitals({ name, delta, id }: Metric) {
  sendTiming('Web Vitals', name, Math.round(name === 'CLS' ? delta * 1000 : delta), id)
}

export function reportWebVitals() {
  getFCP(sendWebVitals)
  getFID(sendWebVitals)
  getLCP(sendWebVitals)
  getCLS(sendWebVitals)
}
interface CookiePreferences {
  interacted: boolean
  analytics: boolean
  marketing?: boolean
  advertising?: boolean
}

export function initGTM() {
  if (typeof process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID === 'string') {
    TagManager.initialize({
      gtmId: process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID,
    })
  }
}

export function initGA4() {
  if (typeof GOOGLE_ANALYTICS_ID === 'string') {
    const storedClientId = window.localStorage.getItem(GOOGLE_ANALYTICS_CLIENT_ID_STORAGE_KEY)
    const gtagOptions: Record<string, any> = {}
    if (process.env.NODE_ENV !== 'production') {
      gtagOptions.debug_mode = true
      gtagOptions.debug = true
    }
    googleAnalytics.initialize(GOOGLE_ANALYTICS_ID, {
      gaOptions: {
        anonymizeIp: true,
        clientId: storedClientId ?? undefined,
        siteSpeedSampleRate: 100,
      },
      gtagOptions,
    })
  } else {
    googleAnalytics.initialize('test', { gtagOptions: { debug_mode: true } })
  }

  googleAnalytics.setDimension(
    Dimensions.customBrowserType,
    !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  )

  // typed as 'any' in react-ga4 -.-
  googleAnalytics.ga((tracker: any) => {
    if (!tracker) return

    const clientId = tracker.get('clientId')
    window.localStorage.setItem(GOOGLE_ANALYTICS_CLIENT_ID_STORAGE_KEY, clientId)
  })
}

export function initAnalytics({ interacted, analytics, marketing, advertising }: CookiePreferences) {
  googleAnalytics.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    marketing_storage: 'denied',
  })

  if (interacted) {
    initGTM()
    initGA4()

    const adStorageConsent = advertising ? 'granted' : 'denied'
    const analyticsStorageConsent = analytics ? 'granted' : 'denied'
    const marketingStorageConsent = marketing ? 'granted' : 'denied'

    devDebug('COOKIES INTERACTED WITH - SETTING GTAG CONSENT')
    devDebug(`
      ADVERTISING: ${adStorageConsent}
      ANALYTICS: ${analyticsStorageConsent}
      MARKETING: ${marketingStorageConsent}
    `)

    googleAnalytics.gtag('consent', 'update', {
      ad_storage: adStorageConsent,
      analytics_storage: analytics ? 'granted' : 'denied',
      marketing_storage: marketing ? 'granted' : 'denied',
    })
  }
}

// TODO: re-enable when BC ready
// export function useBlockchainAnalyticsReporter() {
//   // Handle chain id custom dimension
//   const [, , { chainId, connector, address: account }] = useW3Connection()
//   useEffect(() => {
//     // custom dimension 1 - chainId
//     googleAnalytics.setDimension(Dimensions.chainId, chainId)
//   }, [chainId])

//   // Handle wallet name custom dimension
//   const walletInfo = useWalletInfo()
//   const connection = getConnection(connector)
//   const isMetaMask = getIsMetaMask()

//   const walletName = walletInfo?.walletName || getConnectionName(connection.type, isMetaMask)

//   useEffect(() => {
//     // custom dimension 2 - walletname
//     googleAnalytics.setDimension(Dimensions.walletName, account ? walletName : 'Not connected')
//   }, [account, walletName])
// }

const DEFAULT_COOKIE_CONSENT = { interacted: false, analytics: true, advertising: false, marketing: false }

// tracks web vitals and pageviews
export function useAnalyticsReporter() {
  if (!process.env.REACT_APP_GOOGLE_GA_MEASUREMENT_ID || !process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID) {
    console.error('MISSING GOOGLE GA and/or GOOGLE TAG MANAGER ID KEY! CHECK ENV')
  }

  const { pathname, search } = useLocation()

  // useBlockchainAnalyticsReporter()

  useEffect(() => {
    googleAnalytics.pageview(`${pathname}${search}`)
  }, [pathname, search])

  useEffect(() => {
    const storageItem = localStorage.getItem(process.env.REACT_APP_PASTELLE_COOKIE_SETTINGS || 'PASTELLE_SHOP_cookies')
    const consent: typeof DEFAULT_COOKIE_CONSENT = storageItem ? JSON.parse(storageItem) : DEFAULT_COOKIE_CONSENT

    reportWebVitals()
    initAnalytics(consent)
  }, [])
}
