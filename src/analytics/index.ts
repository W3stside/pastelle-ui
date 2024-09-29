import { sendGTMEvent } from '@next/third-parties/google'

export { useAnalyticsReporter } from './hooks/useAnalyticsReporter'

export const GOOGLE_ANALYTICS_ID: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID
export const GOOGLE_ANALYTICS_CLIENT_ID_STORAGE_KEY = 'ga_client_id'

export function sendEvent(event: string, data: object) {
  return sendGTMEvent({ event, ...data })
}

export function sendError(error: Error, type?: string) {
  return sendGTMEvent({
    event: 'error',
    errorType: type || 'Unknown Error', // Type of error (e.g., network, validation)
    errorMessage: error.message || 'Unknown Error', // Detailed error message
    eventCategory: 'Error Tracking',
    eventAction: 'Error Occurred',
  })
}

export function outboundLink(
  {
    url,
  }: {
    url: string
  },
  hitCallback: () => unknown
) {
  return googleAnalytics.outboundLink({ url }, hitCallback)
}

export * from './events/settingsEvents'
export * from './events/themeEvents'
export * from './events/walletEvents'
export * from './events/otherEvents'

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
