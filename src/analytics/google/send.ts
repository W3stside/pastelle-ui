import { JSONValue } from './types'

export const sendGTMEvent = (data: JSONValue) => {
  // special case if we are sending events before GTM init and we have custom dataLayerName
  const dataLayer = process.env.NEXT_PUBLIC_GTM_DATA_LAYER_NAME || 'dataLayer'
  // define dataLayer so we can still queue up events before GTM init
  window[dataLayer] = window[dataLayer] || []
  ;(window[dataLayer] as JSONValue[]).push(data)
}
