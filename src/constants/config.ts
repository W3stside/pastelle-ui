import { ProductSizes } from 'shopify/graphql/types'

export const CURRENT_DROP = 1
export const DEFAULT_CATALOG_URL = `/drop-${CURRENT_DROP}/catalog`

export const STORE_IMAGE_SIZES = {
  LARGE: 2000,
  SMALL: 600
}

export const CATALOG_MAX_WIDTH = 1950
export const FIXED_IMAGE_SIZE_CONSTRAINTS = {
  fromLarge: '38vw',
  fromExtraLarge: '38vw'
}
export const DEFAULT_SIZE_SELECTED: ProductSizes = ProductSizes.L

export const DEFAULT_IK_TRANSFORMS = {
  LQ: 'pr-true,q-10',
  HQ: 'pr-true',
  LQ_LOGO: 'pr-true,q-10',
  HQ_LOGO: 'pr-true,q-90'
}
