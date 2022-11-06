export const SHOW_CART = !!JSON.parse(process.env.REACT_APP_USE_CHECKOUT || 'false')
export const IS_PRE_PROD = !!JSON.parse(process.env.REACT_APP_IS_PRE_PROD || 'false')
