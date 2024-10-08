import { devWarn } from '@past3lle/utils'
import { sendGTMEvent } from '../google/send'
import { AnalyticsState } from '@/state/analyticsConsent/reducer'

export function sendEvent(event: string, data: object) {
  return sendGTMEvent({ event, ...data })
}

export function gtag(..._args: unknown[]) {
  const dataLayer = process.env.NEXT_PUBLIC_GTM_DATA_LAYER_NAME || 'dataLayer'
  // define dataLayer so we can still queue up events before GTM init
  window[dataLayer] = window[dataLayer] || []
  // eslint-disable-next-line prefer-rest-params
  return (window[dataLayer] as Required<Window>['dataLayer']).push(arguments)
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

export function updateConsent(consent: AnalyticsState['google']['consent'], type: 'update' | 'default' = 'update') {
  if (!consent) return devWarn('[events/base.ts]::sendConsent --> No consent data. Bailing.')

  return gtag('consent', type, consent)
}
