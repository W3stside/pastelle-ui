import { ErrorInfo } from 'react'
import { UaEventOptions } from 'react-ga4/types/ga4'

import GoogleAnalyticsProvider from './GoogleAnalytics4Provider'

export { useAnalyticsReporter } from './hooks/useAnalyticsReporter'

export const GOOGLE_ANALYTICS_ID: string | undefined = import.meta.env.VITE_GOOGLE_GA_MEASUREMENT_ID
export const GOOGLE_ANALYTICS_CLIENT_ID_STORAGE_KEY = 'ga_client_id'

export const googleAnalytics = new GoogleAnalyticsProvider()

export function sendEvent(event: string | UaEventOptions, params?: any) {
  return googleAnalytics.sendEvent(event, params)
}

export function sendError(error: Error, errorInfo: ErrorInfo) {
  return googleAnalytics.sendError(error, errorInfo)
}

export function outboundLink(
  {
    url,
  }: {
    url: string
  },
  hitCallback: () => unknown,
) {
  return googleAnalytics.outboundLink({ url }, hitCallback)
}

const installed = Boolean(window.navigator.serviceWorker?.controller)
const hit = Boolean((window as any).__isDocumentCached)
const action = installed ? (hit ? 'Cache hit' : 'Cache miss') : 'Not installed'
sendEvent({ category: 'Service Worker', action, nonInteraction: true })

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
