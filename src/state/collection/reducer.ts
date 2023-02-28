import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { BaseProductPageProps } from 'pages/common/types'
import { Product } from 'shopify/graphql/types'

export interface ProductCurrentlyViewing {
  handle: Product['handle']
  id: Product['id']
}
export type ProductPageMap = Record<string, BaseProductPageProps>
export type CollectionState = {
  current: { title: string; collection: ProductPageMap; loading: boolean } | null
  // handle name of current on screen product
  currentlyViewing: ProductCurrentlyViewing | null
  loading: boolean
}

const initialState: CollectionState = {
  current: null,
  currentlyViewing: null,
  loading: false,
}

type UpdateCollectionParams = { title: string; collection: ProductPageMap; loading: boolean }

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    updateCollection(state, { payload: { title, collection, loading } }: PayloadAction<UpdateCollectionParams>) {
      state.current = { title, collection, loading } || {}
    },
    updateSingleProductInCollection(
      state,
      { payload: { title, collection: product, loading } }: PayloadAction<UpdateCollectionParams>
    ) {
      state.current = {
        title,
        loading,
        collection: { ...state.current?.collection, ...product },
      }
    },
    updateCurrentlyViewing(state, action: PayloadAction<ProductCurrentlyViewing | null>) {
      state.currentlyViewing = action.payload
    },
    updateLoadingState(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { updateCollection, updateCurrentlyViewing, updateLoadingState, updateSingleProductInCollection } =
  collectionSlice.actions
export const collection = collectionSlice.reducer
