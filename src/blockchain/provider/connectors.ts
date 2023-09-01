import { PstlWeb3AuthConnector } from '@past3lle/wagmi-connectors'
import LOGO_512 from 'assets/images/512_logo.png'
import { pastelleTheme } from 'theme'
import { Chain } from 'wagmi'

export const CONNECTORS = [
  (chains: Chain[]) =>
    PstlWeb3AuthConnector(chains, {
      appName: 'PASTELLE.SHOP',
      network: process.env.REACT_APP_WEB3_AUTH_NETWORK as any,
      projectId: process.env.REACT_APP_WEB3_AUTH_PROJECT_ID as string,
      storageKey: 'session',
      preset: 'DISALLOW_EXTERNAL_WALLETS',
      mfaLevel: 'none',
      uxMode: 'popup',
      themeInfo: {
        mode: 'dark',
        primary: pastelleTheme.modes.DEFAULT.purple,
      },
      url: 'https://pastelle.shop',
      appLogoDark: LOGO_512,
      appLogoLight: LOGO_512,
    }),
]
