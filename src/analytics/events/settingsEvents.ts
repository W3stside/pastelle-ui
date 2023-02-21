import { Category, sendEvent } from '../index'

export function toggleShowcaseAutoplayAnalytics(enable: boolean) {
  sendEvent({
    category: Category.SHOWCASE_VIDEO,
    action: 'TOGGLE SHOWCASE AUTOPLAY',
    label: enable ? 'ENABLED' : 'DISABLED',
  })
}

export function pauseShowcaseVideoAnalytics() {
  sendEvent({
    category: Category.SHOWCASE_VIDEO,
    action: 'PAUSE SHOWCASE VIDEO',
  })
}

export function playShowcaseVideoAnalytics() {
  sendEvent({
    category: Category.SHOWCASE_VIDEO,
    action: 'PLAY SHOWCASE VIDEO',
  })
}
