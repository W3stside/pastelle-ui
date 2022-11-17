import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const Footer = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "FOOTER" */ 'components/Footer'))
const Header = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ 'components/Header'))
const Popups = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "POPUPS" */ 'components/Popups'))
const Collection = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "COLLECTION" */ 'pages/Collection'))
const NotFound = lazy(() => import(/* webpackChunkName: "NOTFOUND" */ 'pages/Error/NotFound'))
const Navigation = lazy(() => import(/* webpackChunkName: "NAVIGATION" */ 'components/Navigation'))
const SingleItem = lazy(() => import(/* webpackChunkName: "SINGLEITEM" */ 'pages/SingleItem'))

import PastelleCursiveLoader from 'components/Loader/PastelleCursiveLoader'

import { FixedAnimatedLoader } from 'components/Loader'
import { useQuery } from '@apollo/client'
import { QUERY_PRODUCT } from 'shopify/graphql/queries/products'
import { COLLECTION_PARAM_NAME } from 'constants/navigation'
import { PRODUCT_AMOUNT, PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from 'constants/config'

const topLevelLoaderProps = {
  top: '0',
  left: '0',
  right: '0',
  bottom: '0'
}
const FallbackLoader = () => <FixedAnimatedLoader loadText={<PastelleCursiveLoader />} {...topLevelLoaderProps} />
export default function App() {
  const { loading } = useQuery(QUERY_PRODUCT, {
    variables: { amount: PRODUCT_AMOUNT, imageAmt: PRODUCT_IMAGES_AMOUNT, videoAmt: PRODUCT_VIDEOS_AMOUNT }
  })

  if (loading) return <FallbackLoader />

  return (
    <Suspense fallback={<FallbackLoader />}>
      <Popups />

      {/* HEADER */}
      <Header />
      {/* SIDE-NAV */}
      <Navigation mobileHide />

      {/* ARTICLE CONTENT */}
      <Routes>
        <Route path={`/${COLLECTION_PARAM_NAME}`} element={<Collection />} />
        <Route path={`/${COLLECTION_PARAM_NAME}/:handle`} element={<SingleItem />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to={`/${COLLECTION_PARAM_NAME}`} replace />} />
      </Routes>

      {/* FOOTER */}
      <Footer />
    </Suspense>
  )
}
