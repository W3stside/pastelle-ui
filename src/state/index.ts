import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { load, save } from 'redux-localstorage-simple'
import { ProductSizes } from 'shopify/graphql/types'
// BLOCKCHAIN
import { blockchainTransactions } from 'state/blockchainTransactions/reducer'
// APPAREL
import { cart } from 'state/cart/reducer'
import { collection } from 'state/collection/reducer'
import { updateVersion } from 'state/global/actions'
import { modalsAndPopups } from 'state/modalsAndPopups/reducer'
// MISC
import { user } from 'state/user/reducer'
import { window } from 'state/window/reducer'
import { ThemeModes } from 'theme'

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
    window,
    // BLOCKCHAIN
    blockchainTransactions,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware({
      thunk: true,
    }).concat(save({ states: PERSISTED_KEYS })),
  preloadedState: load({
    states: PERSISTED_KEYS,
    // because localstorage can sometimes contain stale data from testing...
    // TODO: remove this shit
    preloadedState: {
      user: {
        theme: {
          mode: ThemeModes.DARK,
          autoDetect: false,
        },
        showcase: {
          gender: 'MALE',
          height: 175,
          size: ProductSizes.L,
          videoSettings: {
            autoplay: true,
            status: 'play',
          },
        },
      },
    },
    disableWarnings: process.env.NODE_ENV === 'production',
  }),
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
