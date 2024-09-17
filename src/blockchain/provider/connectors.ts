import { web3Auth } from '@past3lle/wagmi-connectors'
import LOGO_512 from 'assets/images/512_logo.png'
import GOOGLE_APPLE_LOGO from 'assets/images/google-apple.png'

export const CONNECTORS = {
  connectors: [
    web3Auth({
      network: process.env.REACT_APP_WEB3_AUTH_NETWORK as any,
      projectId: process.env.REACT_APP_WEB3_AUTH_PROJECT_ID as string,
      storageKey: 'session',
      preset: 'DISALLOW_EXTERNAL_WALLETS',
      mfaLevel: 'none',
      uxMode: 'popup',
      uiConfig: {
        mode: 'dark',
        appUrl: 'https://pastelle.shop',
        logoDark: LOGO_512,
        logoLight: LOGO_512,
      },
    }),
  ],
  overrides: {
    web3auth: {
      logo: GOOGLE_APPLE_LOGO,
      isRecommended: true,
      customName: 'GOOGLE & MORE',
    },
    walletConnect: {
      logo: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Gradient/Logo.png',
      customName: 'Web3 Wallets',
    },
  },
}
