import { Category, sendEvent } from '../index'

export function changeWalletAnalytics(walletName: string) {
  sendEvent('blockchain__change_wallet', {
    category: Category.WALLET,
    action: 'Change Wallet',
    label: walletName,
  })
}
