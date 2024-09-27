'use client'

import { useAnalyticsReporter } from '@/analytics'
import { CookiesBanner as Cookies } from '@/components/Cookies/Banner'
import { FallbackLoader } from '@/components/Loader'
// import { APPAREL_PARAM_NAME, COLLECTION_PARAM_NAME } from '@/constants/navigation'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useDeriveCurrentCollectionId, useIsCollectionLoading } from '@/state/collection/hooks'
import { usePathname } from 'next/navigation'

// const Home = dynamic(() => import(/* webpackPrefetch: true,  webpackChunkName: "HOME" */ '@/pages/home'))
const Popups = dynamic(() => import(/* webpackPrefetch: true,  webpackChunkName: "POPUPS" */ '@/components/Popups'))
// const NotFound = dynamic(() => import(/* webpackChunkName: "NOTFOUND" */ '@/pages/error/NotFound'))
// const Collection = dynamic(
//   () => import(/* webpackPrefetch: true,  webpackChunkName: "COLLECTION" */ '@/pages/collection')
// )
const Header = dynamic(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ '@/components/Header'))
const Navigation = dynamic(() => import(/* webpackChunkName: "NAVIGATION" */ '@/components/Navigation'))
// const SingleItem = dynamic(() => import(/* webpackChunkName: "SINGLEITEM" */ '@/pages/skill'))
// const Policy = dynamic(() => import(/* webpackChunkName: "POLICY" */ '@/pages/policies'))

export default function App() {
  // attempt to enable analytics, will do nothing if consent not set
  useAnalyticsReporter()

  const currentId = useDeriveCurrentCollectionId()
  const loadingCollectionsData = useIsCollectionLoading()
  const appLoading = !currentId || loadingCollectionsData

  const pathname = usePathname()
  const onHomePage = pathname === '/'

  return (
    <Suspense fallback={<FallbackLoader />}>
      <Popups />

      {/* HEADER + NAVIGATION */}
      <Header />
      {!onHomePage && <Navigation mobileHide />}

      {!onHomePage && appLoading ? (
        <FallbackLoader />
      ) : (
        <Suspense fallback={<FallbackLoader />}>
          {/* <Routes>
            <Route index element={<Home />} />
            <Route path={`/${COLLECTION_PARAM_NAME}/:collection`} element={<Collection />} />
            <Route path={`/${APPAREL_PARAM_NAME}/:handle`} element={<SingleItem />} />

            <Route path={`/policies/:policy`} element={<Policy />} />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to={`/${COLLECTION_PARAM_NAME}/latest`} replace />} />
          </Routes> */}
          <h1>Deprecated!</h1>
        </Suspense>
      )}

      {/* COOKIES */}
      <Cookies />
    </Suspense>
  )
}
