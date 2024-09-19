import { nodeRemoveChildFix } from '@past3lle/utils'
import { createRoot } from 'react-dom/client'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { RootApp } from 'App'

// Node removeChild hackaround
// based on: https://github.com/facebook/react/issues/11538#issuecomment-417504600
nodeRemoveChildFix()

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<RootApp />)

// SERVICE WORKER (e.g USER OFFLINE USE)
// README: change to unregister to remove SW
serviceWorkerRegistration.register()

// WEB VITALS REPORTING
// README: change to unregister to remove web vitals reporting
// reportWebVitals()
