import { PstlHooksProvider } from '@past3lle/hooks'
import {
  RobotoVariableFontProvider,
  StaticGlobalCssProvider,
  ThemeProvider,
  ThemedGlobalCssProvider,
} from '@past3lle/theme'
import { nodeRemoveChildFix } from '@past3lle/utils'
// TODO: re-enable when BC ready
// import { Web3ReactProvider } from '@web3-react/core'
import { isWeb3Enabled } from 'blockchain/connectors'
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
import BlockchainUpdater from 'state/blockchain/updater'
import TransactionUpdater from 'state/blockchainTransactions/updater'
// PASTELLE STORE UPDATERS
import CartUpdater from 'state/cart/updater'
import CollectionUpdater from 'state/collection/updater'
import WindowSizeUpdater from 'state/window/updater'
import { pastelleTheme } from 'theme'
import { CustomStaticGlobalCSSProvider, CustomThemedGlobalCSSProvider } from 'theme/global'

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

  return (
    <>
      <BlockchainUpdater />
      <TransactionUpdater />
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <StrictMode>
    <HelmetProvider>
      {/* @past3lle hooks data provider */}
      <PstlHooksProvider>
        {/* Provides all top level CSS NOT dynamically adjustable by the ThemeProvider */}
        <StaticCSSProviders />
        <ApolloProvider>
          <Provider store={store}>
            <HashRouter>
              {/* <Web3ReactProvider connectors={CONNECTORS}> */}
              <PastelleStoreUpdaters />
              <BlockchainUpdaters />
              <ThemeProvider theme={pastelleTheme} defaultMode="DARK">
                {/* Provides all top level CSS dynamically adjustable by the ThemeProvider */}
                <ThemedCSSProviders />
                <App />
              </ThemeProvider>
              {/* </Web3ReactProvider> */}
            </HashRouter>
          </Provider>
        </ApolloProvider>
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
