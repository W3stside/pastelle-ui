import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CatalogItemsMap, CatalogSeason, CatalogSeasonItemMap, CatalogSeasonsMap } from 'mock/apparel/types'

export type CatalogState = CatalogItemsMap

export type BlockNumberState = {
  chainId: number
  blockNumber: number
}

const initialState: CatalogState = {
  '2022': {
    WINTER: {},
    SPRING: {},
    SUMMER: {},
    FALL: {}
  }
}

type UpdateCatalogParams = { year: number | string; catalog: CatalogSeasonsMap }

type UpdateCatalogBySeasonParams = { year: number | string; season: CatalogSeason; catalog: CatalogSeasonItemMap }

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    updateCatalog(state, { payload: { year, season, catalog } }: PayloadAction<UpdateCatalogBySeasonParams>) {
      state[year][season] = catalog || {}
    },
    batchUpdateCatalogByYear(state, { payload: { year, catalog } }: PayloadAction<UpdateCatalogParams>) {
      state[year] = { ...state[year], ...(catalog || {}) }
    },
    removeCatalogSeason(
      state,
      { payload: { year, season } }: PayloadAction<Omit<UpdateCatalogBySeasonParams, 'payload'>>
    ) {
      delete state[year][season]
    },
    removeCatalogSeasonItem(
      state,
      {
        payload: { year, season, itemKey }
      }: PayloadAction<Omit<UpdateCatalogBySeasonParams, 'payload'> & { itemKey: string }>
    ) {
      if (state[year]?.[season]?.[itemKey]) {
        delete state[year][season]?.[itemKey]
      }
    }
  }
})

export const {
  batchUpdateCatalogByYear,
  updateCatalog,
  removeCatalogSeason,
  removeCatalogSeasonItem
} = catalogSlice.actions
export const catalog = catalogSlice.reducer
