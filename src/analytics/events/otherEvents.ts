import { Category, sendEvent } from '../index'
import { detectExplorer } from '../utils'

export function externalLinkAnalytics(href: string) {
  const explorer = detectExplorer(href)

  if (explorer) {
    sendEvent({
      category: Category.EXTERNAL_LINK,
      action: `View on ${explorer}`,
      label: href,
    })
  }
}
