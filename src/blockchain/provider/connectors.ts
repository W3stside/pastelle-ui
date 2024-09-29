import { web3Auth } from '@past3lle/wagmi-connectors'
import { Web3AuthParameters } from '@past3lle/wagmi-connectors'
import LOGO_512 from 'assets/images/512_logo.png'
import GOOGLE_APPLE_LOGO from 'assets/images/google-apple.png'

const HAS_WEB3AUTH_ENV = Boolean(
  process.env.NEXT_PUBLIC_WEB3_AUTH_NETWORK && process.env.NEXT_PUBLIC_WEB3_AUTH_PROJECT_ID
)

const connectors = [
  HAS_WEB3AUTH_ENV &&
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
] as const

const CONNECTORS = {
  connectors: connectors.filter((c) => !!c),
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

if (!HAS_WEB3AUTH_ENV) {
  console.warn(
    'Missing process.env.NEXT_PUBLIC_WEB3_AUTH_PROJECT_ID and/or process.env.NEXT_PUBLIC_WEB3_AUTH_PROJECT_ID - skipping connector initialisation. If you want to include this connector please check the .env config.'
  )
}

export { CONNECTORS }
