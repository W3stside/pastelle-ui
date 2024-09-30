import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  ShopifyPageViewPayload,
} from '@shopify/hydrogen-react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { sendPageViewEvents } from '../events/pageViewEvents'
import { useParams, usePathname } from 'next/navigation'

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

  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  useEffect(() => {
    const handleRouteChange = () => {
      sendPageView(analytics)
      sendPageViewEvents({ url: router.route, pageTitle: document.title, pathname, params: JSON.stringify(params) })
    }

    // First load event guard
    if (!isInit) {
      isInit = true
      sendPageView(analytics)
    }

    // send route events
    handleRouteChange()
  }, [analytics, router.route, pathname, params])

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
