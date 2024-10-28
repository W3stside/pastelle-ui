import { ErrorBoundary, Row } from '@past3lle/components'
import { useIsMobile } from '@past3lle/hooks'
import { ThemeProvider } from '@past3lle/theme'
import { AppErrorFallback } from '@/components/Error/fallbacks/AppErrorFallback'
import { PastelleStoreUpdaters, StaticCSSProviders, ThemedCSSProviders } from 'Providers'
import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import ApolloProvider from '@/shopify/graphql/ApolloProvider'
import { wrapper } from '@/state'
import { AnalyticsConsentUpdater } from '@/state/analyticsConsent/updater'
import { VersionUpdater } from '@/state/version/updater'
import { pastelleTheme, ThemeModes } from '@/theme'
import { getLocalStorageThemeModeOrDefault } from '@/utils/localstorage'
import { AppProps } from 'next/app'
import { usePathname } from 'next/navigation'

import { ShopifyProvider } from '@shopify/hydrogen-react'
import { useShopifyAnalyticsRouteChange as useShopifyAnalytics } from '@/analytics/hooks/useShopifyAnalyticsReporter'
import { Layout } from '@/components/Layout'
import { CountryCode, LanguageCode } from '@/shopify/graphql/types'
import { devError } from '@past3lle/utils'

import { PastelleToast } from '@/components/Toast'
import 'react-toastify/dist/ReactToastify.min.css'

if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN)
  throw new Error('Missing process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!')
if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN)
  throw new Error('Missing process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!')
if (!process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION)
  devError('Missing process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION! Defaulting to latest.')

const shopifyConfig: Parameters<typeof ShopifyProvider>[0] = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  storefrontApiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || 'latest',
  countryIsoCode: (process.env.NEXT_PUBLIC_SHOPIFY_COUNTRY_ISO_CODE as CountryCode) || 'PT',
  languageIsoCode: (process.env.NEXT_PUBLIC_SHOPIFY_LANGUAGE_ISO_CODE as LanguageCode) || 'EN',
}

function RootApp({ Component, ...rest }: AppProps<{ nonce: string }>) {
  // Inject redux SSR state props
  const store = wrapper.useStore()
  const pagePropsWithAppAnalytics = useShopifyAnalytics({ pageProps: rest.pageProps })

  const isMobile = useIsMobile()
  const pathname = usePathname()
  useEffect(() => {
    toast(<PastelleToast header="END OF THE YEAR SALE IS LIVE" body="15€ OFF!" isMobile={isMobile} />)
    return toast.dismiss
  }, [pathname])

  return (
    <>
      <ShopifyProvider {...shopifyConfig}>
        <ThemeProvider theme={pastelleTheme} defaultMode={getLocalStorageThemeModeOrDefault(ThemeModes.DARK)}>
          {/* Provides all top level CSS NOT dynamically adjustable by the ThemeProvider */}
          <StaticCSSProviders />
          <ApolloProvider>
            <Provider store={store}>
              {/* GA/GTM Consent Updater */}
              <AnalyticsConsentUpdater />
              <VersionUpdater />
              {/* <AppOnlineStatusUpdater /> */}
              <PastelleStoreUpdaters />
              {/* Provides all top level CSS dynamically adjustable by the ThemeProvider */}
              <ThemedCSSProviders />
              <ErrorBoundary fallback={<AppErrorFallback />}>
                <Layout>
                  <Component {...pagePropsWithAppAnalytics} />
                </Layout>
                <ToastContainer
                  toastClassName="pastelle-toast"
                  position={isMobile ? 'top-middle' : 'bottom-right'}
                  closeOnClick
                  newestOnTop
                  limit={1}
                  autoClose={5000}
                />
              </ErrorBoundary>
            </Provider>
          </ApolloProvider>
        </ThemeProvider>
      </ShopifyProvider>
    </>
  )
}
export default RootApp
