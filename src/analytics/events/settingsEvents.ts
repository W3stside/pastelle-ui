import { gtag } from './base'
import { Category } from './types'

export function toggleShowcaseAutoplayAnalytics(enable: boolean) {
  gtag('event', 'settings__showcase_autoplay', {
    eventCategory: Category.USER_INTERFACE,
    eventAction: 'Toggle showcase autoplay',
    value: enable ? 'ENABLED' : 'DISABLED',
  })
}

export function pauseShowcaseVideoAnalytics() {
  gtag('event', 'settings__showcase_pause', {
    eventCategory: Category.USER_INTERFACE,
    eventAction: 'Pause showcase video',
    value: 'PAUSE',
  })
}

export function playShowcaseVideoAnalytics() {
  gtag('event', 'settings__showcase_play', {
    eventCategory: Category.USER_INTERFACE,
    eventAction: 'Play showcase video',
    value: 'PLAY',
  })
}
