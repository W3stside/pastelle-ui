import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { save, load } from 'redux-localstorage-simple'
// MISC
import { user } from 'state/user/reducer'
import { modalsAndPopups } from 'state/modalsAndPopups/reducer'
import { window } from 'state/window/reducer'
// APPAREL
import { cart } from 'state/cart/reducer'
import { collection } from 'state/collection/reducer'
// BLOCKCHAIN
import { blockchain } from 'state/blockchain/reducer'
import { blockchainMulticall } from 'state/blockchainMulticall/reducer'
import { blockchainTransactions } from 'state/blockchainTransactions/reducer'
import { updateVersion } from 'state/global/actions'

import { ProductSizes } from 'shopify/graphql/types'

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
    blockchain,
    blockchainMulticall,
    blockchainTransactions
  },
  middleware: defaultMiddleware =>
    defaultMiddleware({
      thunk: true
    }).concat(save({ states: PERSISTED_KEYS })),
  preloadedState: load({
    states: PERSISTED_KEYS,
    // because localstorage can sometimes contain stale data from testing...
    preloadedState: { user: { showcase: { size: ProductSizes.L, gender: 'MALE', height: 175 } } },
    disableWarnings: process.env.NODE_ENV === 'test'
  })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
