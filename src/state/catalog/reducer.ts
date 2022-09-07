import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'

export type ProductPageMap = Record<string, ProductPageProps>
export type CatalogState = {
  [drop: string]: ProductPageMap | null
} & {
  current: ProductPageMap | null
}

const initialState: CatalogState = {
  current: null
}

type UpdateCatalogParams = { drop: 'current' | number; catalog: ProductPageMap }

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
    }
  }
})

export const { batchUpdateCatalogByYear, updateCatalog, removeCatalogSeason } = catalogSlice.actions
export const catalog = catalogSlice.reducer
