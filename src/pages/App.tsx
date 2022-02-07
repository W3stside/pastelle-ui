import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'

import ThemeViewer from 'components/ThemeViewer'
import Popups from 'components/Popups'
import Web3ReactManager from 'components/blockchain/Web3ReactManager'

import Header from 'components/Header'
import { StyledNavLink } from 'components/Header/styleds'
// import Footer from 'components/Footer'

import Home from 'pages/Home'
import styled from 'styled-components/macro'

const Navigation = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: start;

  text-align: left;

  padding: 10px;
  gap: 10px;

  // all links in nav
  > a {
    font-size: 16px;
  }
`

export default function App() {
  return (
    <Web3ReactManager>
      <Suspense fallback={null}>
        <Popups />
        {/* HEADER */}
        <Header />
        {/* SIDE-NAV */}
        <Navigation>
          <StyledNavLink to="/#">{'// LONGSLEEVE'}</StyledNavLink>
          <StyledNavLink to="/#">{'// SHORTSLEEVE'}</StyledNavLink>
          <StyledNavLink to="/#">{'// HOODIES'}</StyledNavLink>
        </Navigation>
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
