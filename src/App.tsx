import { ErrorBoundary } from '@past3lle/components'
import { ThemeProvider } from '@past3lle/theme'
import { PastelleForgeW3Provider } from 'blockchain/provider/ForgeW3Provider'
import { AppErrorFallback } from '@/components/Error/fallbacks/AppErrorFallback'
import App from '@/pages/App'
import { StaticCSSProviders, PastelleStoreUpdaters, ThemedCSSProviders } from 'Providers'
import { StrictMode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import ApolloProvider from '@/shopify/graphql/ApolloProvider'
import store from '@/state'
import { VersionUpdater } from '@/state/version/updater'
import { pastelleTheme, ThemeModes } from '@/theme'
import { getLocalStorageThemeModeOrDefault } from 'utils/localstorage'

export const RootApp = () => (
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider theme={pastelleTheme} defaultMode={getLocalStorageThemeModeOrDefault(ThemeModes.DARK)}>
        {/* @past3lle hooks data provider */}
        <PastelleForgeW3Provider>
          {/* Provides all top level CSS NOT dynamically adjustable by the ThemeProvider */}
          <StaticCSSProviders />
          <ApolloProvider>
            <Provider store={store}>
              <BrowserRouter basename="/">
                <VersionUpdater />
                {/* <AppOnlineStatusUpdater /> */}
                <PastelleStoreUpdaters />
                {/* Provides all top level CSS dynamically adjustable by the ThemeProvider */}
                <ThemedCSSProviders />
                <ErrorBoundary fallback={<AppErrorFallback />}>
                  <App />
                </ErrorBoundary>
              </BrowserRouter>
            </Provider>
          </ApolloProvider>
        </PastelleForgeW3Provider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
)
