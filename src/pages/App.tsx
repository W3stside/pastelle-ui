import { lazy, Suspense } from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'

import Web3ReactManager from 'components/blockchain/Web3ReactManager'

const Footer = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "FOOTER" */ 'components/Footer'))
const Header = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ 'components/Header'))
const Popups = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "POPUPS" */ 'components/Popups'))
const Catalog = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "CATALOG" */ 'pages/Catalog'))
const NotFound = lazy(() => import(/* webpackChunkName: "NOTFOUND" */ 'pages/Error/NotFound'))
const Navigation = lazy(() => import(/* webpackChunkName: "NAVIGATION" */ 'components/Navigation'))
const SingleItem = lazy(() => import(/* webpackChunkName: "SINGLEITEM" */ 'pages/SingleItem'))

import PastelleCursiveLoader from 'components/Loader/PastelleCursiveLoader'

import { FixedAnimatedLoader } from 'components/Loader'
import { useQuery } from '@apollo/client'
import { QUERY_PRODUCT } from 'shopify/graphql/queries/products'
import { DEFAULT_CATALOG_URL } from 'constants/config'

export function RedirectPathToCatalogOnly({ location }: RouteComponentProps) {
  return (
    <Redirect
      to={{
        ...location,
        pathname: DEFAULT_CATALOG_URL
      }}
    />
  )
}

export default function App() {
  const { loading } = useQuery(QUERY_PRODUCT, { variables: { amount: 5, imageAmt: 20 } })

  if (loading) return <FixedAnimatedLoader loadText={<PastelleCursiveLoader />} />

  return (
    <Web3ReactManager>
      <Suspense fallback={<FixedAnimatedLoader loadText={<PastelleCursiveLoader />} />}>
        <Popups />

        {/* HEADER */}
        <Header />
        {/* SIDE-NAV */}
        <Navigation mobileHide />
        {/* ARTICLE CONTENT */}
        <Switch>
          <Route exact path="/drop-:drop/catalog" component={Catalog} />
          <Route exact path="/drop-:drop/:item" component={SingleItem} />
          <Route exact path="/404" component={NotFound} />
          <Route component={RedirectPathToCatalogOnly} />
          <Route component={NotFound} />
        </Switch>
        {/* FOOTER */}
        <Footer />
      </Suspense>
    </Web3ReactManager>
  )
}
