export const FORGE_WEB3_ENABLED =
  JSON.parse(process.env.NEXT_PUBLIC_USE_FORGE || 'false') && process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID
export const SHOWCASE_ENABLED = JSON.parse(process.env.NEXT_PUBLIC_USE_SHOWCASE || 'false')
export const CART_ENABLED = JSON.parse(process.env.NEXT_PUBLIC_USE_CHECKOUT || 'false')
export const PRE_PROD_ENABLED = JSON.parse(process.env.NEXT_PUBLIC_IS_PRE_PROD || 'true')
export const MOCK_ENABLED = JSON.parse(process.env.NEXT_PUBLIC_IS_MOCK || 'false')
