import { sendEvent } from './base'
import { Category } from './types'

export function changeWalletAnalytics(walletName: string) {
  sendEvent('blockchain__change_wallet', {
    category: Category.BLOCKCHAIN,
    action: 'Change Wallet',
    label: walletName,
    value: walletName,
  })
}
