import { sendGTMEvent } from '../google/send'

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
