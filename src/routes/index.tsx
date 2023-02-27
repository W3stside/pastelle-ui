import { APPAREL_PARAM_NAME, COLLECTION_PARAM_NAME } from 'constants/navigation'
import { lazy } from 'react'
import { Navigate, Route, createRoutesFromElements } from 'react-router-dom'

const NotFound = lazy(() => import(/* webpackChunkName: "NOTFOUND" */ 'pages/Error/NotFound'))
const Collection = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "COLLECTION" */ 'pages/Collection'))
const SingleItem = lazy(() => import(/* webpackChunkName: "SINGLEITEM" */ 'pages/SingleProduct'))

export const ROUTES = createRoutesFromElements(
  <>
    <Route path={`/${COLLECTION_PARAM_NAME}`} element={<Collection />} />
    <Route path={`/${APPAREL_PARAM_NAME}/:handle`} element={<SingleItem />} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<Navigate to={`/${COLLECTION_PARAM_NAME}`} replace />} />
  </>
)
