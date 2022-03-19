import { CatalogSeason, ItemSizes } from 'mock/apparel/types'

export const CURRENT_YEAR = new Date().getFullYear()
export const CURRENT_SEASON: CatalogSeason = 'FALL'

export const SEASONS: CatalogSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
export const STORE_IMAGE_SIZES = {
  LARGE: 2000,
  SMALL: 500
}
export const SHIRT_SIZES: ItemSizes[] = ['X-LARGE', 'LARGE', 'MEDIUM', 'SMALL']
