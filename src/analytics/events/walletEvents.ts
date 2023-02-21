import { Category, sendEvent } from '../index'

export function changeWalletAnalytics(walletName: string) {
  sendEvent({
    category: Category.WALLET,
    action: 'Change Wallet',
    label: walletName,
  })
}
