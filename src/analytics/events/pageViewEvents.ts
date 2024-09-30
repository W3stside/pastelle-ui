import { sendEvent } from './base'

export function sendPageViewEvents({
  url,
  pageTitle,
  params,
  pathname
}: {
  url: string
  pageTitle: string
  params: string
  pathname: string
}) {
  sendEvent('page_view', {
    url, // The URL of the page being viewed
    pageTitle,
    pathname,
    params,
    eventCategory: 'Page View',
    eventAction: 'Page Load',
  })
}
