import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import { Product } from 'shopify/graphql/types'

export interface ProductCurrentlyViewing {
  handle: Product['handle']
  id: Product['id']
}
export type ProductPageMap = Record<string, ProductPageProps>
export type CollectionState = {
  [drop: string]: ProductPageMap | null
} & {
  currentDrop: ProductPageMap | null
  // key string of current on screen item
  currentlyViewing: ProductCurrentlyViewing | null
}

const initialState: CollectionState = {
  currentDrop: null,
  currentlyViewing: null
}

type UpdateCollectionParams = { drop: 'currentDrop' | number; collection: ProductPageMap }

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    updateCollection(state, { payload: { drop, collection } }: PayloadAction<UpdateCollectionParams>) {
      state[drop] = collection || {}
    },
    batchUpdateCollectionByYear(state, { payload: { drop, collection } }: PayloadAction<UpdateCollectionParams>) {
      state[drop] = { ...state[drop], ...(collection || {}) }
    },
    removeCollectionSeason(state, { payload: { drop } }: PayloadAction<Omit<UpdateCollectionParams, 'collection'>>) {
      delete state[drop]
    },
    updateCurrentlyViewing(state, action: PayloadAction<ProductCurrentlyViewing | null>) {
      state.currentlyViewing = action.payload
    }
  }
})

export const {
  batchUpdateCollectionByYear,
  updateCollection,
  removeCollectionSeason,
  updateCurrentlyViewing
} = collectionSlice.actions
export const collection = collectionSlice.reducer
