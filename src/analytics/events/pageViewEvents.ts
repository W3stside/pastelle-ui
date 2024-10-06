import { gtag } from './base'
import { Category } from './types'

export function sendPageViewEvents({
  url,
  pageTitle,
  params,
  pathname,
}: {
  url: string
  pageTitle: string
  params: string
  pathname: string
}) {
  gtag('event', 'page_view', {
    eventCategory: Category.PAGE_VIEW,
    url, // The URL of the page being viewed
    pageTitle,
    pathname,
    params,
    eventAction: 'Page Load',
  })
}
