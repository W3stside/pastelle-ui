export enum Category {
  PAGE_VIEW = 'Page View',
  ECOMMERCE = 'Ecommerce',
  USER_INTERFACE = 'User Interface',
  BLOCKCHAIN = 'Blockchain',
  EXTERNAL_LINK = 'External Link',
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
  adPersonalisation?: boolean
  adUserData?: boolean
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
