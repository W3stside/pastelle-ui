import { Suspense } from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'

import ThemeViewer from 'components/ThemeViewer'
import Popups from 'components/Popups'
import Web3ReactManager from 'components/blockchain/Web3ReactManager'

import Header from 'components/Header'
// import Footer from 'components/Footer'

import Catalog from 'pages/Catalog'
import Navigation from 'components/Navigation'
import NotFound from './Error/NotFound'
import { useCatalogByYearAndSeason } from 'state/catalog/hooks'
import { ItemHeader } from './SingleItem/styleds'

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
        pathname: `/catalog/${DEFAULT_CATALOG_YEAR}/${DEFAULT_CATALOG_SEASON}/${DEFAULT_CATALOG_START_ITEM}`
      }}
    />
  )
}

const FixedContainer = styled.div`
  position: fixed;
  top: 25%;
  bottom: 25%;
  left: 25%;
  right: 25%;
`

export default function App() {
  // We need something to show. We'll go with catalog by year and season, why not.
  // if there isn't yet data, show something else
  const catalogBySeason = useCatalogByYearAndSeason({ year: '2022', season: 'FALL' })

  if (!catalogBySeason)
    return (
      <FixedContainer>
        <ItemHeader itemColor="#FFBEBC" animation animationDelay={false}>
          PSTL
        </ItemHeader>
      </FixedContainer>
    )

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
          <Route exact path="/404" component={NotFound} />
          <Route component={RedirectPathToCatalogOnly} />
          <Route component={NotFound} />
        </Switch>
        {/* FOOTER */}
        {/* <Footer /> */}
      </Suspense>
    </Web3ReactManager>
  )
}
