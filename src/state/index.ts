import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { load, save } from 'redux-localstorage-simple'
import { createWrapper } from 'next-redux-wrapper'

// APPAREL
import { cart } from '@/state/cart/reducer'
import { collection } from '@/state/collection/reducer'
import { modalsAndPopups } from '@/state/modalsAndPopups/reducer'
// MISC
import { user } from '@/state/user/reducer'
import { hydrateSSR } from './global/reducer'

const IS_SERVER = typeof globalThis?.window == 'undefined'
const PERSISTED_KEYS: string[] = ['blockchainTransactions', 'cart', 'collection', 'user']

const makeStore = () =>
  configureStore({
    reducer: {
      // GLOBAL -- SSR REDUX
      hydrateSSR,
      // APPAREL
      cart,
      collection,
      // MISC
      modalsAndPopups,
      user,
    },
    middleware: IS_SERVER
      ? undefined
      : (defaultMiddleware) =>
          defaultMiddleware({
            thunk: true,
          }).concat(save({ states: PERSISTED_KEYS, namespace: 'PASTELLE_SHOP' })),
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

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true })
