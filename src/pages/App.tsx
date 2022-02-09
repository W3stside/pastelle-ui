import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'

import ThemeViewer from 'components/ThemeViewer'
import Popups from 'components/Popups'
import Web3ReactManager from 'components/blockchain/Web3ReactManager'

import Header from 'components/Header'
// import Footer from 'components/Footer'

import Home from 'pages/Home'
import Navigation from 'components/Navigation'

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
          <Route exact path="/" component={Home} />
          <Route exact path="/theme" component={ThemeViewer} />
        </Switch>
        {/* FOOTER */}
        {/* <Footer /> */}
      </Suspense>
    </Web3ReactManager>
  )
}
