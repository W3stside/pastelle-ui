export { useAnalyticsReporter } from './hooks/useAnalyticsReporter'

export const GOOGLE_ANALYTICS_ID: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID
export const GOOGLE_ANALYTICS_CLIENT_ID_STORAGE_KEY = 'ga_client_id'

export * from './events/base'
export * from './utils'
export * from './events/cartEvents'
export * from './events/settingsEvents'
export * from './events/themeEvents'
export * from './events/walletEvents'
export * from './events/productViewEvents'
export * from './events/blockchainEvents'
