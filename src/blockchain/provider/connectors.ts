import { web3Auth } from '@past3lle/wagmi-connectors'
import { Web3AuthParameters } from '@past3lle/wagmi-connectors'
import LOGO_512 from 'assets/images/512_logo.png'
import GOOGLE_APPLE_LOGO from 'assets/images/google-apple.png'

if (!process.env.NEXT_PUBLIC_WEB3_AUTH_NETWORK) throw new Error('Missing NEXT_PUBLIC_WEB3_AUTH_NETWORK')
if (!process.env.NEXT_PUBLIC_WEB3_AUTH_PROJECT_ID) throw new Error('Missing NEXT_PUBLIC_WEB3_AUTH_PROJECT_ID')

export const CONNECTORS = {
  connectors: [
    web3Auth({
      network: process.env.NEXT_PUBLIC_WEB3_AUTH_NETWORK as Web3AuthParameters['network'],
      projectId: process.env.NEXT_PUBLIC_WEB3_AUTH_PROJECT_ID as string,
      storageKey: 'session',
      preset: 'DISALLOW_EXTERNAL_WALLETS',
      mfaLevel: 'none',
      uxMode: 'popup',
      uiConfig: {
        mode: 'dark',
        appUrl: 'https://pastelle.shop',
        logoDark: LOGO_512.src,
        logoLight: LOGO_512.src,
      },
    }),
  ],
  overrides: {
    web3auth: {
      logo: GOOGLE_APPLE_LOGO.src,
      isRecommended: true,
      customName: 'GOOGLE & MORE',
    },
    walletConnect: {
      logo: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Gradient/Logo.png',
      customName: 'Web3 Wallets',
    },
  },
}
