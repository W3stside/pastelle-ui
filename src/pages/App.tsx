import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'

import ThemeViewer from 'components/ThemeViewer'
import Popups from 'components/Popups'
import Web3ReactManager from 'components/blockchain/Web3ReactManager'

import Header, { StyledNavLink } from 'components/Header'
import Footer from 'components/Footer'

import Home from 'pages/Home'
import styled from 'styled-components/macro'

const Navigation = styled.nav``

export default function App() {
  return (
    <Web3ReactManager>
      <Suspense fallback={null}>
        <Popups />
        <Header />
        <Navigation>
          <StyledNavLink to="/#">{'// LONGSLEEVE'}</StyledNavLink>
          <StyledNavLink to="/#">{'// SHORTSLEEVE'}</StyledNavLink>
          <StyledNavLink to="/#">{'// HOODIES'}</StyledNavLink>
        </Navigation>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/theme" component={ThemeViewer} />
        </Switch>
        <Footer />
      </Suspense>
    </Web3ReactManager>
  )
}
