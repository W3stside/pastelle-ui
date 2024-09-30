export enum Category {
  APPAREL = 'APPAREL',
  CART = 'CART',
  SHOWCASE_VIDEO = 'SHOWCASE VIDEO',
  WALLET = 'WALLET',
  THEME = 'THEME',
  EXTERNAL_LINK = 'EXTERNAL LINK',
}

export interface EventParams {
  category: Category
  action: string
  label?: string
  value?: number
}

export interface CookiePreferences {
  interacted: boolean
  analytics: boolean
  marketing?: boolean
  advertising?: boolean
}

export enum Dimensions {
  chainId = 'chainId',
  walletName = 'walletName',
  customBrowserType = 'customBrowserType',
}

export const DIMENSION_MAP = {
  [Dimensions.chainId]: 'dimension1',
  [Dimensions.walletName]: 'dimension2',
  [Dimensions.customBrowserType]: 'dimension3',
}
export type DimensionKey = keyof typeof DIMENSION_MAP

export enum Explorers {
  Explorer = 'Explorer',
  Blockscout = 'Blockscout',
  Etherscan = 'Etherscan',
}
