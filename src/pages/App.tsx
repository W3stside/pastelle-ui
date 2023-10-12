import { useIsSmallMediaWidth } from '@past3lle/hooks'
import { useAnalyticsReporter } from 'analytics'
import { CookiesBanner as Cookies } from 'components/Cookies/Banner'
import { FallbackLoader } from 'components/Loader'
import { APPAREL_PARAM_NAME, COLLECTION_PARAM_NAME } from 'constants/navigation'
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useDeriveCurrentCollectionId, useIsCollectionLoading } from 'state/collection/hooks'

const Header = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ 'components/Header'))
const Popups = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "POPUPS" */ 'components/Popups'))
const NotFound = lazy(() => import(/* webpackChunkName: "NOTFOUND" */ 'pages/Error/NotFound'))
const Collection = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "COLLECTION" */ 'pages/Collection'))
const Navigation = lazy(() => import(/* webpackChunkName: "NAVIGATION" */ 'components/Navigation'))
const SingleItem = lazy(() => import(/* webpackChunkName: "SINGLEITEM" */ 'pages/SingleProduct'))
const Policy = lazy(() => import(/* webpackChunkName: "POLICY" */ 'pages/policies'))

export default function App() {
  // attempt to enable analytics, will do nothing if consent not set
  useAnalyticsReporter()

  const isMobileWidthOrBelow = useIsSmallMediaWidth()

  const currentId = useDeriveCurrentCollectionId()
  const loadingCollectionsData = useIsCollectionLoading()

  const appLoading = !currentId || loadingCollectionsData

  return (
    <Suspense fallback={<FallbackLoader />}>
      <Popups />

      {/* HEADER + NAVIGATION */}
      <Header />
      {!isMobileWidthOrBelow && <Navigation mobileHide />}

      {appLoading ? (
        <FallbackLoader />
      ) : (
        <Suspense fallback={<FallbackLoader />}>
          <Routes>
            <Route path={`/${COLLECTION_PARAM_NAME}/:collection`} element={<Collection />} />
            <Route path={`/${APPAREL_PARAM_NAME}/:handle`} element={<SingleItem />} />

            <Route path={`/policies/:policy`} element={<Policy />} />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to={`/${COLLECTION_PARAM_NAME}/latest`} replace />} />
          </Routes>
        </Suspense>
      )}

      {/* COOKIES */}
      <Cookies />
    </Suspense>
  )
}
