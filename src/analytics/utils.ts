import { devDebug, devError } from '@past3lle/utils'
import { sendEvent } from '@/analytics/events/base'
import { CookiePreferences, Explorers } from './events/types'

const EXPLORER_HOSTNAMES: { [hostname: string]: true } = {
  'etherscan.io': true,
  'ropsten.etherscan.io': true,
  'rinkeby.etherscan.io': true,
  'kovan.etherscan.io': true,
  'goerli.etherscan.io': true,
  'optimistic.etherscan.io': true,
  'kovan-optimistic.etherscan.io': true,
  'rinkeby-explorer.arbitrum.io': true,
  'arbiscan.io': true,
}

/**
 * Returns the anonymized version of the given href, i.e. one that does not leak user information
 * @param href the link to anonymize, i.e. remove any personal data from
 * @return string anonymized version of the given href
 */
export function anonymizeLink(href: string): string {
  try {
    const url = new URL(href)
    if (EXPLORER_HOSTNAMES[url.hostname]) {
      const pathPieces = url.pathname.split('/')

      const anonymizedPath = pathPieces.map((pc) => (/0x[a-fA-F0-9]+/.test(pc) ? '***' : pc)).join('/')

      return `${url.protocol}//${url.hostname}${anonymizedPath}`
    }
    return href
  } catch (error: unknown) {
    devError('[analytics::utils] Error!', error)
    return href
  }
}

// Used for GA ExternalLink detection
export function detectExplorer(href: string) {
  if (href.includes('explorer')) {
    return Explorers.Explorer
  } else if (href.includes('blockscout')) {
    return Explorers.Blockscout
  } else if (href.includes('etherscan')) {
    return Explorers.Etherscan
  } else {
    return undefined
  }
}

export function initAnalytics({ interacted, marketing, advertising }: CookiePreferences) {
  if (interacted) {
    const adStorageConsent = advertising ? 'granted' : 'denied'
    const analyticsStorageConsent = 'granted'
    const marketingStorageConsent = marketing ? 'granted' : 'denied'

    devDebug('COOKIES INTERACTED WITH - SETTING GTAG CONSENT')
    devDebug(`
      ADVERTISING: ${adStorageConsent}
      ANALYTICS: ${analyticsStorageConsent}
      MARKETING: ${marketingStorageConsent}
    `)

    sendEvent('consent_update', {
      consent: {
        ad_storage: adStorageConsent,
        analytics_storage: analyticsStorageConsent,
        marketing_storage: marketingStorageConsent,
      },
    })
  }
}
