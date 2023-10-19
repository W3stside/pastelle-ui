import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { load, save } from 'redux-localstorage-simple'
// APPAREL
import { cart } from 'state/cart/reducer'
import { collection } from 'state/collection/reducer'
import { updateVersion } from 'state/global/actions'
import { modalsAndPopups } from 'state/modalsAndPopups/reducer'
// MISC
import { user } from 'state/user/reducer'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

const PERSISTED_KEYS: string[] = ['blockchainTransactions', 'cart', 'collection', 'user']

const store = configureStore({
  reducer: {
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
    }).concat(save({ states: PERSISTED_KEYS, namespace: 'PASTELLE_SHOP' })),
  preloadedState: load({
    states: PERSISTED_KEYS,
    namespace: 'PASTELLE_SHOP',
    disableWarnings: process.env.NODE_ENV === 'production',
  }),
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
