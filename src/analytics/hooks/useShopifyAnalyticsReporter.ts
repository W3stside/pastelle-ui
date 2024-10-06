import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  ShopifyPageViewPayload,
} from '@shopify/hydrogen-react'
import { AppProps } from 'next/app'
import { useEffect, useMemo } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'

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

  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()
  useEffect(() => {
    const handleRouteChange = () => {
      sendShopifyPageView(analytics)
    }

    // First load event guard
    if (!isInit) {
      isInit = true
      sendShopifyPageView(analytics)
    }

    // send route events
    handleRouteChange()
  }, [analytics, pathname, params, searchParams])

  return pagePropsWithAnalytics
}

function sendShopifyPageView(analyticsPageData: ShopifyPageViewPayload) {
  const payload: ShopifyPageViewPayload = {
    ...getClientBrowserParameters(),
    ...analyticsPageData,
  }
  sendShopifyAnalytics({
    eventName: AnalyticsEventName.PAGE_VIEW,
    payload,
  })
}
