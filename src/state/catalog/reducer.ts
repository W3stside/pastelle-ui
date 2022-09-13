import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import { Product } from 'shopify/graphql/types'

export interface ProductCurrentlyViewing {
  handle: Product['handle']
  id: Product['id']
}
export type ProductPageMap = Record<string, ProductPageProps>
export type CatalogState = {
  [drop: string]: ProductPageMap | null
} & {
  currentDrop: ProductPageMap | null
  // key string of current on screen item
  currentlyViewing: ProductCurrentlyViewing | null
}

const initialState: CatalogState = {
  currentDrop: null,
  currentlyViewing: null
}

type UpdateCatalogParams = { drop: 'currentDrop' | number; catalog: ProductPageMap }

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    updateCatalog(state, { payload: { drop, catalog } }: PayloadAction<UpdateCatalogParams>) {
      state[drop] = catalog || {}
    },
    batchUpdateCatalogByYear(state, { payload: { drop, catalog } }: PayloadAction<UpdateCatalogParams>) {
      state[drop] = { ...state[drop], ...(catalog || {}) }
    },
    removeCatalogSeason(state, { payload: { drop } }: PayloadAction<Omit<UpdateCatalogParams, 'catalog'>>) {
      delete state[drop]
    },
    updateCurrentlyViewing(state, action: PayloadAction<ProductCurrentlyViewing | null>) {
      state.currentlyViewing = action.payload
    }
  }
})

export const {
  batchUpdateCatalogByYear,
  updateCatalog,
  removeCatalogSeason,
  updateCurrentlyViewing
} = catalogSlice.actions
export const catalog = catalogSlice.reducer
