import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { BaseProductPageProps } from '@/pages/common/types'
import { Product } from '@/shopify/graphql/types'
import { ShopifyId } from '@/shopify/utils'

export interface ProductCurrentlyViewing {
  handle: Product['handle']
  id: Product['id']
}
export type ProductPageMap = { [productHandle: string]: BaseProductPageProps }
export type CollectionProductMap = { id: string; title?: string; locked: boolean; products: ProductPageMap }

export type CollectionID = ShopifyId<'Collection'>

export type CollectionState = {
  current: { id: string; locked: boolean; loading: boolean } | null
  collections: {
    [key: string]: CollectionProductMap
  }
  latest: string | null
  // handle name of current on screen product
  currentlyViewing: ProductCurrentlyViewing | null
  loading: boolean
}

const initialState: CollectionState = {
  current: null,
  collections: {},
  latest: null,
  currentlyViewing: null,
  loading: false,
}

type UpdateCollectionsParams = { collections: CollectionProductMap[]; loading: boolean }
type UpdateCollectionParams = { id?: string; locked?: boolean; loading: boolean }
type UpdateProductInCollectionParams = { id: string; product: CollectionProductMap['products'][string] }

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    updateCollections(state, { payload: { collections, loading } }: PayloadAction<UpdateCollectionsParams>) {
      const collectionMap = collections.reduce(
        (acc, collection) => {
          acc[collection.id] = collection
          return acc
        },
        {} as CollectionState['collections'],
      )

      state.loading = loading
      state.collections = { ...state.collections, ...collectionMap }
      state.latest = (collections?.[0]?.id as string) || null
      // set the current collection to our first collection if it doesn't exist
      if (!state.current) {
        state.current = {
          id: collections?.[1]?.id,
          locked: collections?.[1]?.locked,
          loading: false,
        }
      }
    },
    updateCurrentCollection(
      state,
      { payload: { id, locked = false, loading } }: PayloadAction<UpdateCollectionParams>,
    ) {
      if (!id) return
      state.current = { id, locked, loading }
    },
    updateSingleProductInCollection(
      state,
      { payload: { id, product } }: PayloadAction<UpdateProductInCollectionParams>,
    ) {
      const productToUpdate = state.collections[id]?.products[product.handle]
      if (!productToUpdate) return
      state.collections[id] = {
        ...state.collections[id],
        [product.handle]: product,
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

export const {
  updateCollections,
  updateCurrentCollection,
  updateCurrentlyViewing,
  updateLoadingState,
  updateSingleProductInCollection,
} = collectionSlice.actions
export const collection = collectionSlice.reducer
