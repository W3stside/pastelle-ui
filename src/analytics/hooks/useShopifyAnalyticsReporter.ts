import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  ShopifyPageViewPayload,
} from '@shopify/hydrogen-react'
import { AppProps } from 'next/app'
import router from 'next/router'
import { useEffect, useMemo } from 'react'
import { sendPageViewEvents } from '../events/pageViewEvents'

const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_DEV_GA == 'true' || process.env.NODE_ENV === 'production'

const analyticsShopData = {
  shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID,
  currency: 'EUR',
  acceptedLanguage: 'en',
}
let isInit = false

interface Props {
  pageProps: AppProps['pageProps']
}
export function useShopifyAnalyticsRouteChange({ pageProps }: Props) {
  const [analytics, pagePropsWithAnalytics] = useMemo(() => {
    const analytics: ShopifyPageViewPayload = {
      hasUserConsent: ANALYTICS_ENABLED,
      ...analyticsShopData,
      ...pageProps.analytics,
    }
    const pagePropsWithAppAnalytics = {
      ...pageProps,
      analytics,
    }

    return [analytics, pagePropsWithAppAnalytics]
  }, [pageProps])

  useEffect(() => {
    const handleRouteChange = (url) => {
      sendPageView(analytics)
      sendPageViewEvents(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    // First load event guard
    if (!isInit) {
      isInit = true
      sendPageView(analytics)
    }

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analytics, router.events])

  return pagePropsWithAnalytics
}

function sendPageView(analyticsPageData: ShopifyPageViewPayload) {
  const payload: ShopifyPageViewPayload = {
    ...getClientBrowserParameters(),
    ...analyticsPageData,
  }
  sendShopifyAnalytics({
    eventName: AnalyticsEventName.PAGE_VIEW,
    payload,
  })
}
