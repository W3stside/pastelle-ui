import 'inter-ui'
import './i18n'

import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'

import { StrictMode } from 'react'
// PROVIDERS
import { Provider } from 'react-redux'
import ApolloProvider from 'shopify/graphql/ApolloProvider'
import ThemeProvider from 'theme'

import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'

import { NetworkContextName } from 'blockchain/constants'
import getLibrary from 'blockchain/utils/getLibrary'

import App from './pages/App'

import store from 'state'
import BlockchainUpdater from 'state/blockchain/updater'
import TransactionUpdater from 'state/blockchainTransactions/updater'
import UserUpdater from 'state/user/updater'
import CatalogUpdater from 'state/catalog/updater'

import { TopGlobalStyle, ThemedGlobalComponent, FontStyles } from 'theme/styles/global'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { nodeRemoveChildFix } from 'utils/node'
import { devLog } from 'utils/logging'

// Node removeChild hackaround
// based on: https://github.com/facebook/react/issues/11538#issuecomment-417504600
nodeRemoveChildFix()

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <UserUpdater />
      <BlockchainUpdater />
      <TransactionUpdater />
      <CatalogUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    {/* Provides all top level CSS NOT dynamically adjustable by the ThemeProvider */}
    <FontStyles />
    <TopGlobalStyle />
    <ApolloProvider>
      <Provider store={store}>
        <HashRouter>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
              <Updaters />
              <ThemeProvider>
                {/* Provides all top level CSS dynamically adjustable by the ThemeProvider */}
                <ThemedGlobalComponent />
                <App />
              </ThemeProvider>
            </Web3ProviderNetwork>
          </Web3ReactProvider>
        </HashRouter>
      </Provider>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root')
)

async function deleteAllCaches() {
  const cacheNames = (await caches.keys()) || []

  cacheNames.map(cacheName => {
    devLog('[worker] Delete cache', cacheName)
    // Delete old caches
    // https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker#removing_outdated_caches
    return caches.delete(cacheName)
  })
}

async function unregisterAllWorkers() {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (const registration of registrations) {
      registration.unregister()
    }
  })
}

if ('serviceWorker' in navigator) {
  devLog('[worker] Unregister worker...')
  serviceWorkerRegistration.unregister()

  devLog('[worker] Deleting all caches...')
  deleteAllCaches()
    .then(() => devLog('[worker] All caches have been deleted'))
    .catch(console.error)

  devLog('[worker] Unregistering all workers...')
  unregisterAllWorkers()
    .then(() => devLog('[worker] All workers have been unregistered'))
    .catch(console.error)
}
