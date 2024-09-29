'use client'

import { ErrorBoundary } from '@past3lle/components'
import { ThemeProvider } from '@past3lle/theme'
import { PastelleForgeW3Provider } from '@/blockchain/provider/ForgeW3Provider'
import { AppErrorFallback } from '@/components/Error/fallbacks/AppErrorFallback'
// import App from '@/pages/ClientApp'
import { StaticCSSProviders, PastelleStoreUpdaters, ThemedCSSProviders } from 'Providers'
import { Provider } from 'react-redux'
import ApolloProvider from '@/shopify/graphql/ApolloProvider'
import { wrapper } from '@/state'
import { VersionUpdater } from '@/state/version/updater'
import { pastelleTheme, ThemeModes } from '@/theme'
import { getLocalStorageThemeModeOrDefault } from '@/utils/localstorage'
import { AppProps } from 'next/app'

import { ShopifyProvider } from '@shopify/hydrogen-react'
import { useShopifyAnalyticsRouteChange } from '@/analytics/hooks/useShopifyAnalyticsReporter'
import { Layout } from '@/components/Layout'

if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN)
  throw new Error('Missing process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!')
if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN)
  throw new Error('Missing process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!')
if (!process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION)
  throw new Error('Missing process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION!')
if (!process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID) throw new Error('Missing process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID!')

const shopifyConfig: Parameters<typeof ShopifyProvider>[0] = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  storefrontApiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  countryIsoCode: 'PT',
  languageIsoCode: 'EN',
}

function RootApp({ Component, ...pageProps }: AppProps) {
  // Inject redux SSR state props
  const { store, props } = wrapper.useWrappedStore(pageProps)
  const pagePropsWithAppAnalytics = useShopifyAnalyticsRouteChange({ pageProps: props.pageProps })

  return (
    <ShopifyProvider {...shopifyConfig}>
      <ThemeProvider theme={pastelleTheme} defaultMode={getLocalStorageThemeModeOrDefault(ThemeModes.DARK)}>
        {/* @past3lle hooks data provider */}
        <PastelleForgeW3Provider>
          {/* Provides all top level CSS NOT dynamically adjustable by the ThemeProvider */}
          <StaticCSSProviders />
          <ApolloProvider>
            <Provider store={store}>
              <VersionUpdater />
              {/* <AppOnlineStatusUpdater /> */}
              <PastelleStoreUpdaters />
              {/* Provides all top level CSS dynamically adjustable by the ThemeProvider */}
              <ThemedCSSProviders />
              <ErrorBoundary fallback={<AppErrorFallback />}>
                <Layout>
                  <Component {...pagePropsWithAppAnalytics} />
                </Layout>
              </ErrorBoundary>
            </Provider>
          </ApolloProvider>
        </PastelleForgeW3Provider>
      </ThemeProvider>
    </ShopifyProvider>
  )
}

export default RootApp
