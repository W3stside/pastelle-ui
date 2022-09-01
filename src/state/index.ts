import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { save, load } from 'redux-localstorage-simple'

import { user } from 'state/user/reducer'
import { application } from 'state/application/reducer'
// APPAREL
import { catalog } from 'state/catalog/reducer'
// BLOCKCHAIN
import { blockchain } from 'state/blockchain/reducer'
import { blockchainMulticall } from 'state/blockchainMulticall/reducer'
import { blockchainTransactions } from 'state/blockchainTransactions/reducer'
import { updateVersion } from 'state/global/actions'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

const PERSISTED_KEYS: string[] = ['user', 'blockchainTransactions', 'lists', 'catalog']

const store = configureStore({
  reducer: {
    // APPAREL
    catalog,
    // MISC
    application,
    // BLOCKCHAIN
    blockchain,
    blockchainMulticall,
    blockchainTransactions,
    user
  },
  middleware: defaultMiddleware =>
    defaultMiddleware({
      thunk: true
    }).concat(save({ states: PERSISTED_KEYS })),
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: process.env.NODE_ENV === 'test' })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
