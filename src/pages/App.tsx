import { Suspense } from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'

import ThemeViewer from 'components/ThemeViewer'
import Popups from 'components/Popups'
import Web3ReactManager from 'components/blockchain/Web3ReactManager'

import Header from 'components/Header'
// import Footer from 'components/Footer'

import Catalog from 'pages/Catalog'
import Navigation from 'components/Navigation'

// TODO: move
// Redirects to swap but only replace the pathname
const DEFAULT_CATALOG_YEAR = '2022'
const DEFAULT_CATALOG_SEASON = 'FALL'
const DEFAULT_CATALOG_START_ITEM = 'LEER'
export function RedirectPathToCatalogOnly({ location }: RouteComponentProps) {
  return (
    <Redirect
      to={{
        ...location,
        pathname: `catalog/${DEFAULT_CATALOG_YEAR}/${DEFAULT_CATALOG_SEASON}/${DEFAULT_CATALOG_START_ITEM}`
      }}
    />
  )
}

export default function App() {
  return (
    <Web3ReactManager>
      <Suspense fallback={null}>
        <Popups />
        {/* HEADER */}
        <Header />
        {/* SIDE-NAV */}
        <Navigation />
        {/* ARTICLE CONTENT */}
        <Switch>
          <Route exact strict path="/catalog/:year/:season/:itemName" component={Catalog} />
          <Route exact path="/theme" component={ThemeViewer} />
          <Route component={RedirectPathToCatalogOnly} />
        </Switch>
        {/* FOOTER */}
        {/* <Footer /> */}
      </Suspense>
    </Web3ReactManager>
  )
}
