import { PstlHooksProvider } from '@past3lle/hooks'
import {
  RobotoVariableFontProvider,
  StaticGlobalCssProvider,
  ThemeProvider,
  ThemedGlobalCssProvider,
} from '@past3lle/theme'
import { nodeRemoveChildFix } from '@past3lle/utils'
import { PstlW3Providers } from '@past3lle/web3-modal'
import { WEB3_MODAL_PROPS } from 'config/w3m'
// PROVIDERS
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import reportWebVitals from 'reportWebVitals'
import ApolloProvider from 'shopify/graphql/ApolloProvider'
import store from 'state'
// BC UPDATERS
import TransactionUpdater from 'state/blockchainTransactions/updater'
// PASTELLE STORE UPDATERS
import CartUpdater from 'state/cart/updater'
import CollectionUpdater from 'state/collection/updater'
import WindowSizeUpdater from 'state/window/updater'
import { pastelleTheme } from 'theme'
import { CustomStaticGlobalCSSProvider, CustomThemedGlobalCSSProvider } from 'theme/global'
import { isWeb3Enabled } from 'utils/blockchain'

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
      <WindowSizeUpdater />
      <CollectionUpdater />
    </>
  )
}

function BlockchainUpdaters() {
  const isEnabled = isWeb3Enabled()

  if (!isEnabled) return null

  return <TransactionUpdater />
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <StrictMode>
    <HelmetProvider>
      {/* @past3lle hooks data provider */}
      <PstlHooksProvider>
        <PstlW3Providers config={WEB3_MODAL_PROPS}>
          {/* Provides all top level CSS NOT dynamically adjustable by the ThemeProvider */}
          <StaticCSSProviders />
          <ApolloProvider>
            <Provider store={store}>
              <HashRouter>
                <PastelleStoreUpdaters />
                <BlockchainUpdaters />
                <ThemeProvider theme={pastelleTheme} defaultMode="DARK">
                  {/* Provides all top level CSS dynamically adjustable by the ThemeProvider */}
                  <ThemedCSSProviders />
                  <App />
                </ThemeProvider>
              </HashRouter>
            </Provider>
          </ApolloProvider>
        </PstlW3Providers>
      </PstlHooksProvider>
    </HelmetProvider>
  </StrictMode>
)

// SERVICE WORKER (e.g USER OFFLINE USE)
// README: change to unregister to remove SW
serviceWorkerRegistration.register()

// WEB VITALS REPORTING
// README: change to unregister to remove web vitals reporting
reportWebVitals()
