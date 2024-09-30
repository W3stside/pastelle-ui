import { sendEvent } from './base'
import { Category } from './types'

export function toggleShowcaseAutoplayAnalytics(enable: boolean) {
  sendEvent('settings__showcase_autoplay', {
    eventCategory: Category.USER_INTERFACE,
    eventAction: 'Toggle showcase autoplay',
    label: enable ? 'ENABLED' : 'DISABLED',
    value: enable ? 'ENABLED' : 'DISABLED',
  })
}

export function pauseShowcaseVideoAnalytics() {
  sendEvent('settings__showcase_pause', {
    eventCategory: Category.USER_INTERFACE,
    eventAction: 'Pause showcase video',
    value: 'PAUSE',
  })
}

export function playShowcaseVideoAnalytics() {
  sendEvent('settings__showcase_play', {
    eventCategory: Category.USER_INTERFACE,
    eventAction: 'Play showcase video',
    value: 'PLAY',
  })
}
