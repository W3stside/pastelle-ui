import { CookieBanner } from '@past3lle/components'
import { devDebug } from '@past3lle/utils'
import { useAnalyticsReporter } from 'analytics'
import { initAnalytics } from 'analytics/hooks/useAnalyticsReporter'
import { FallbackLoader } from 'components/Loader'
import { APPAREL_PARAM_NAME, COLLECTION_PARAM_NAME } from 'constants/navigation'
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useCollectionLoadingStatus } from 'state/collection/hooks'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'

const Header = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ 'components/Header'))
const Popups = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "POPUPS" */ 'components/Popups'))
const NotFound = lazy(() => import(/* webpackChunkName: "NOTFOUND" */ 'pages/Error/NotFound'))
const Collection = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "COLLECTION" */ 'pages/Collection'))
const Navigation = lazy(() => import(/* webpackChunkName: "NAVIGATION" */ 'components/Navigation'))
const SingleItem = lazy(() => import(/* webpackChunkName: "SINGLEITEM" */ 'pages/SingleProduct'))

export default function App() {
  // attempt to enable analytics, will do nothing if consent not set
  useAnalyticsReporter()

  const isMobileWidthOrBelow = useIsMobileWindowWidthSize()

  const loading = useCollectionLoadingStatus()
  if (loading) return <FallbackLoader />

  return (
    <Suspense fallback={<FallbackLoader />}>
      <Popups />

      {/* HEADER */}
      <Header />
      {/* SIDE-NAV */}
      {!isMobileWidthOrBelow && <Navigation mobileHide />}

      {/* ARTICLE CONTENT */}
      <Routes>
        <Route path={`/${COLLECTION_PARAM_NAME}`} element={<Collection />} />
        <Route path={`/${APPAREL_PARAM_NAME}/:handle`} element={<SingleItem />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to={`/${COLLECTION_PARAM_NAME}`} replace />} />
      </Routes>

      <CookieBanner
        storageKey={process.env.REACT_APP_PASTELLE_COOKIE_SETTINGS || 'PASTELLE_COOKIE_SETTINGS'}
        message={'COOKIES?'}
        fullText={
          <div>
            <p>
              WE REALLY ONLY HAVE OPT-IN <strong>ANALYTICS</strong> COOKIES FOR 3 REASONS:
            </p>
            <div style={{ marginLeft: '2rem' }}>
              <p>1. See which of our items are most popular</p>
              <p>2. Assess which parts of our site aren&apos;t working well and/or where you guys are getting stuck</p>
              <p>3. Get a sense for if you guys like the showcase video option and other new features</p>
            </div>
          </div>
        }
        // onAcceptAdvertising={() => console.warn('ACCEPT ADVERTISING')}
        onAcceptAnalytics={() => console.warn('ACCEPT ANALYTICS')}
        onSaveAndClose={(cookieState) => {
          devDebug('COOKIE BANNER SAVED AND CLOSED.', cookieState)
          initAnalytics(cookieState)
        }}
      />
    </Suspense>
  )
}
