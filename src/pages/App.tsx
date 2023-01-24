import { useQuery } from '@apollo/client'
import { CookieBanner } from '@past3lle/components'
import { FallbackLoader } from 'components/Loader'
import { PRODUCT_AMOUNT, PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from 'constants/config'
import { COLLECTION_PARAM_NAME } from 'constants/navigation'
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { QUERY_PRODUCT } from 'shopify/graphql/queries/products'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'

const Header = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ 'components/Header'))
const Popups = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "POPUPS" */ 'components/Popups'))
const Collection = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "COLLECTION" */ 'pages/Collection'))
const NotFound = lazy(() => import(/* webpackChunkName: "NOTFOUND" */ 'pages/Error/NotFound'))
const Navigation = lazy(() => import(/* webpackChunkName: "NAVIGATION" */ 'components/Navigation'))
const SingleItem = lazy(() => import(/* webpackChunkName: "SINGLEITEM" */ 'pages/SingleProduct'))

export default function App() {
  const { loading } = useQuery(QUERY_PRODUCT, {
    variables: { amount: PRODUCT_AMOUNT, imageAmt: PRODUCT_IMAGES_AMOUNT, videoAmt: PRODUCT_VIDEOS_AMOUNT },
  })

  const isMobileWidthOrBelow = useIsMobileWindowWidthSize()

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
        <Route path={`/${COLLECTION_PARAM_NAME}/:handle`} element={<SingleItem />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to={`/${COLLECTION_PARAM_NAME}`} replace />} />
      </Routes>

      <CookieBanner
        storageKey={process.env.REACT_APP_PASTELLE_COOKIE_SETTINGS || 'PASTELLE_COOKIE_SETTINGS'}
        message={'PASTELLE COOKIE SETTINGS'}
      />
    </Suspense>
  )
}
