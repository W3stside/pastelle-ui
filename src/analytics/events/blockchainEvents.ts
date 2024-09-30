import { detectExplorer } from '../utils'
import { sendEvent } from './base'
import { Category } from './types'

export function blockchainAccountAnalytics(wallet: string) {
  sendEvent('blockchain__account', {
    category: Category.WALLET,
    label: 'blockchain__wallet',
    value: wallet,
  })
}

export function blockchainChainAnalytics(id?: number) {
  sendEvent('blockchain__chain_id', {
    category: Category.WALLET,
    label: 'blockchain__chain_id',
    value: id || 'web3_disconnected',
  })
}

export function externalLinkAnalytics(href: string) {
  const explorer = detectExplorer(href)

  if (explorer) {
    sendEvent('blockchain__view_on_explorer', {
      category: Category.EXTERNAL_LINK,
      action: `View on ${explorer}`,
      label: href,
    })
  }
}
