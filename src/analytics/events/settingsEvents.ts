import { Category, sendEvent } from '../index'

export function toggleShowcaseAutoplayAnalytics(enable: boolean) {
  sendEvent({
    category: Category.SHOWCASE_VIDEO,
    action: 'Toggle showcase autoplay',
    label: enable ? 'ENABLED' : 'DISABLED',
  })
}

export function pauseShowcaseVideoAnalytics() {
  sendEvent({
    category: Category.SHOWCASE_VIDEO,
    action: 'Pause showcase video',
  })
}

export function playShowcaseVideoAnalytics() {
  sendEvent({
    category: Category.SHOWCASE_VIDEO,
    action: 'Play showcase video',
  })
}
