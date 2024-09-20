import { outboundLink } from 'analytics'

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
    console.error('[analytics::utils] Error!', error)
    return href
  }
}

export function handleClickExternalLink(event: React.MouseEvent<HTMLAnchorElement>) {
  const { target, href } = event.currentTarget

  const anonymizedHref = anonymizeLink(href)

  // don't prevent default, don't redirect if it's a new tab
  if (target === '_blank' || event.ctrlKey || event.metaKey) {
    outboundLink({ url: anonymizedHref }, () => {
      console.debug('Fired outbound link event', anonymizedHref)
    })
  } else {
    event.preventDefault()
    // send a ReactGA event and then trigger a location change
    outboundLink({ url: anonymizedHref }, () => {
      window.location.href = anonymizedHref
    })
  }
}

enum Explorers {
  Explorer = 'Explorer',
  Blockscout = 'Blockscout',
  Etherscan = 'Etherscan',
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
