import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { BaseProductPageProps } from 'pages/common/types'
import { Product } from 'shopify/graphql/types'

export interface ProductCurrentlyViewing {
  handle: Product['handle']
  id: Product['id']
}
export type ProductPageMap = Record<string, BaseProductPageProps>
export type CollectionState = {
  [drop: string]: ProductPageMap | null
} & {
  current: { title: string; collection: ProductPageMap } | null
  // handle name of current on screen product
  currentlyViewing: ProductCurrentlyViewing | null
}

const initialState: CollectionState = {
  current: null,
  currentlyViewing: null
}

type UpdateCollectionParams = { title: string; collection: ProductPageMap }

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    updateCollection(state, { payload: { title, collection } }: PayloadAction<UpdateCollectionParams>) {
      state.current = { title, collection } || {}
    },
    updateCurrentlyViewing(state, action: PayloadAction<ProductCurrentlyViewing | null>) {
      state.currentlyViewing = action.payload
    }
  }
})

export const { updateCollection, updateCurrentlyViewing } = collectionSlice.actions
export const collection = collectionSlice.reducer
