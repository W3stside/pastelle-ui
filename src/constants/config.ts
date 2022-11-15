import { ProductSizes } from 'shopify/graphql/types'

export const CURRENT_DROP = 1
export const DEFAULT_COLLECTION_URL = `/drop-${CURRENT_DROP}/collection`

/**
 * PRODUCT VIDEO AMTS
 *
 * 4 SIZES: S, M, L, XL
 * 4 MODEL HEIGHTS PER SIZE
 * 2 GENDERS: MALE, FEMALE
 *
 * = 32 VIDEOS
 */
export const PRODUCT_VIDEOS_AMOUNT = 32
/**
 * PRODUCT AMTS
 *
 * 6 ITEMS PER COLLECTIONS
 */
export const PRODUCT_AMOUNT = 6
/**
 * PRODUCT IMAGES AMT
 *
 * 2 PRODUCT IMAGS: FRONT, BACK
 * 3 META IMAGES: HEADER, NAVBAR, LOGO
 *
 * = 5 IMAGES
 */
export const PRODUCT_IMAGES_AMOUNT = 5

export const STORE_IMAGE_SIZES = {
  LARGE: 2000,
  SMALL: 600
}

export const COLLECTION_MAX_WIDTH = 1950
export const FIXED_IMAGE_SIZE_CONSTRAINTS = {
  fromLarge: '38vw',
  fromExtraLarge: '38vw'
}
export const DEFAULT_SIZE_SELECTED: ProductSizes = ProductSizes.L

export const DEFAULT_IK_TRANSFORMS = {
  LQ_IMAGE: 'q-10,w-1,h-1:',
  HQ_IMAGE: '',
  LQ_LOGO: 'q-40,',
  HQ_LOGO: 'q-70,'
}

export const enum Z_INDEXES {
  BEHIND = -1,
  ZERO = 0,
  MENU_FLYOUT = 100,
  PRODUCT_CONTENT = 100,
  PRODUCT_VIDEOS = 200,
  NAV_MENU = 200,
  SHOPPING_CART = 300,
  SCROLLER_DIV = 900,
  MODALS = 9999
}
export const DEFAULT_CART_LINES_AMOUNT = 30
export const FREE_SHIPPING_THRESHOLD: number | undefined = 200
