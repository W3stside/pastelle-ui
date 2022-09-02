import { CatalogSeason, ItemSizes } from 'mock/types'
import { ProductSizes } from 'shopify/graphql/types'

export const CURRENT_YEAR = new Date().getFullYear()
export const CURRENT_SEASON: CatalogSeason = 'FALL'

export const SEASONS: CatalogSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
export const STORE_IMAGE_SIZES = {
  LARGE: 2000,
  SMALL: 600
}
export const SHIRT_SIZES: ItemSizes[] = ['X-LARGE', 'LARGE', 'MEDIUM', 'SMALL']
export const CATALOG_MAX_WIDTH = 1950
export const FIXED_IMAGE_SIZE_CONSTRAINTS = {
  fromLarge: '30vw',
  fromExtraLarge: '30vw'
}
export const DEFAULT_SIZE_SELECTED: ProductSizes = ProductSizes.L

export const DEFAULT_IK_TRANSFORMS = {
  LQ: 'pr-true,q-10',
  HQ: 'pr-true',
  LQ_LOGO: 'pr-true,q-1',
  HQ_LOGO: 'pr-true,q-85'
}
