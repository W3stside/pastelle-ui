import {
  RobotoVariableFontProvider,
  StaticGlobalCssProvider,
  ThemeProvider,
  ThemedGlobalCssProvider,
} from '@past3lle/theme'
import { nodeRemoveChildFix } from '@past3lle/utils'
import { PastelleForgeW3Provider } from 'blockchain/provider/ForgeW3Provider'
import { ErrorBoundary } from 'components/Error/ErrorBoundary'
import { AppErrorFallback } from 'components/Error/fallbacks/AppErrorFallback'
// PROVIDERS
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
// WEB VITALS
import reportWebVitals from 'reportWebVitals'
import ApolloProvider from 'shopify/graphql/ApolloProvider'
// STATE
import store from 'state'
// PASTELLE STORE UPDATERS
import CartUpdater from 'state/cart/updater'
import CollectionUpdater from 'state/collection/updater'
import { VersionUpdater } from 'state/version/updater'
import { ThemeModes, pastelleTheme } from 'theme'
import { CustomStaticGlobalCSSProvider, CustomThemedGlobalCSSProvider } from 'theme/global'
import { getLocalStorageThemeModeOrDefault } from 'utils/localstorage'

import App from './pages/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

// Node removeChild hackaround
// based on: https://github.com/facebook/react/issues/11538#issuecomment-417504600
nodeRemoveChildFix()

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function PastelleStoreUpdaters() {
  return (
    <>
      <CartUpdater />
      <CollectionUpdater />
    </>
  )
}

function StaticCSSProviders() {
  return (
    <>
      <RobotoVariableFontProvider />
      <StaticGlobalCssProvider />
      <CustomStaticGlobalCSSProvider />
    </>
  )
}

function ThemedCSSProviders() {
  return (
    <>
      <ThemedGlobalCssProvider />
      <CustomThemedGlobalCSSProvider />
    </>
  )
}

const RootApp = () => (
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<RootApp />)

// SERVICE WORKER (e.g USER OFFLINE USE)
// README: change to unregister to remove SW
serviceWorkerRegistration.register()

// WEB VITALS REPORTING
// README: change to unregister to remove web vitals reporting
reportWebVitals()
