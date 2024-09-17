import { ProductSizes } from 'shopify/graphql/types'
import { pastelleTheme } from 'theme'

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
 * 4 PRODUCT IMAGS: FRONT, BACK, FRONT-LOCKED, BACK-LOCKED
 * 3 META IMAGES: HEADER, NAVBAR, LOGO
 *
 * = 7 IMAGES
 */
export const PRODUCT_IMAGES_AMOUNT = 7

export const STORE_IMAGE_SIZES = {
  LARGE: 2000,
  SMALL: 600,
}

export const SINGLE_ITEM_LOGO_RATIO = [20, 73]

export const COLLECTION_MAX_WIDTH = 2370
export const FIXED_IMAGE_SIZE_CONSTRAINTS = {
  fromLarge: '38vw',
  fromExtraLarge: '38vw',
}
export const DEFAULT_SIZE_SELECTED: ProductSizes = ProductSizes.L

export const enum Z_INDEXES {
  BEHIND = -1,
  ZERO = 0,
  MENU_FLYOUT = 100,
  PRODUCT_CONTENT = 100,
  PRODUCT_VIDEOS = 200,
  NAV_MENU = 200,
  HEADER = 201,
  SHOPPING_CART = 300,
  SCROLLER_DIV = 900,
  MODALS = 9999,
  COOKIE_BANNER = 10000,
}
export const DEFAULT_CART_LINES_AMOUNT = 30
export const FREE_SHIPPING_THRESHOLD: number | undefined = 200

export const DEFAULT_IK_TRANSFORMS = {
  LQ_IMAGE: 'pr-true,q-10,w-1,h-1:',
  HQ_IMAGE: 'pr-true,',
  LQ_LOGO: 'pr-true,q-40,',
  HQ_LOGO: 'pr-true,q-70,',
}

export const SINGLE_ITEM_ASIDE_CSS_LOGO_TRANSFORMS = [
  `pr-true,dpr-2,q-70,w-${STORE_IMAGE_SIZES.SMALL},h-2400`,
  `pr-true,dpr-2,q-40,w-${STORE_IMAGE_SIZES.SMALL},h-2400`,
]
export const NAV_CSS_LOGO_TRANSFORMS = ['pr-true,dpr-2,q-70,w-183', 'pr-true,dpr-2,q-40,w-183']
export const MINIMUM_COLLECTION_ITEM_HEIGHT = 773
export const DEFAULT_CAROUSEL_ACCENT_COLOR = pastelleTheme.modes.DARK.purple1 || '#000'

export const SHOWCASE_ENABLED = process.env.REACT_APP_USE_SHOWCASE == 'true'

export const TRANSPARENT_HEX = '#e5e5e500'
export const PLACEHOLDER_HIGHLIGHT_COLOUR = '#fcc4ed' || '#B6B8DC'
