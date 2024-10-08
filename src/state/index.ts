import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { load, save } from 'redux-localstorage-simple'
import { createWrapper } from 'next-redux-wrapper'

// APPAREL
import { analyticsConsent } from '@/state/analyticsConsent/reducer'
import { cart } from '@/state/cart/reducer'
import { collection } from '@/state/collection/reducer'
import { modalsAndPopups } from '@/state/modalsAndPopups/reducer'
import { user } from '@/state/user/reducer'

const IS_SERVER = typeof globalThis?.window == 'undefined'
const PERSISTED_KEYS: string[] = ['blockchainTransactions', 'cart', 'collection', 'user']

const makeStore = ({ reduxWrapperMiddleware }) =>
  configureStore({
    reducer: {
      // ANALYTICS
      analyticsConsent,
      // APPAREL
      cart,
      collection,
      // MISC
      modalsAndPopups,
      user,
    },
    middleware: (defaultMiddleware) =>
      defaultMiddleware({
        thunk: true,
      }).concat(IS_SERVER ? [] : save({ states: PERSISTED_KEYS, namespace: 'PASTELLE_SHOP' }), reduxWrapperMiddleware),
    preloadedState: IS_SERVER
      ? undefined
      : load({
          states: PERSISTED_KEYS,
          namespace: 'PASTELLE_SHOP',
          disableWarnings: process.env.NODE_ENV === 'production',
        }),
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const wrapper = createWrapper<AppStore>(makeStore, { debug: process.env.NODE_ENV !== 'production' })
