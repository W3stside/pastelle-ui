import { sendGTMEvent } from '@next/third-parties/google'

export function sendPageViewEvents(url: string) {
  sendGTMEvent({
    event: 'page_view', // Standard GTM event for page views
    pageUrl: url, // The URL of the page being viewed
    eventCategory: 'Page View',
    eventAction: 'Page Load',
  })
}
