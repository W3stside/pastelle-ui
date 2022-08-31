import { CatalogSeason, ItemSizes } from 'mock/types'

export const CURRENT_YEAR = new Date().getFullYear()
export const CURRENT_SEASON: CatalogSeason = 'FALL'

export const SEASONS: CatalogSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
export const STORE_IMAGE_SIZES = {
  LARGE: 2000,
  SMALL: 600
}
export const SHIRT_SIZES: ItemSizes[] = ['X-LARGE', 'LARGE', 'MEDIUM', 'SMALL']
export const CATALOG_MAX_WIDTH = 1950
