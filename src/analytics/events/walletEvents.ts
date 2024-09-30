import { sendEvent } from './base'
import { Category } from './types'

export function changeWalletAnalytics(walletName: string) {
  sendEvent('blockchain__change_wallet', {
    category: Category.WALLET,
    action: 'Change Wallet',
    label: walletName,
    value: walletName
  })
}
