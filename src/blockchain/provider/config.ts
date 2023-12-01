import { ForgeWeb3ModalProps } from '@past3lle/forge-web3'
import GOOGLE_APPLE_LOGO from 'assets/images/google-apple.png'
import { pstlModalTheme as MODAL_THEME, pastelleTheme } from 'theme'
import { polygon, polygonMumbai } from 'wagmi/chains'

import { CONNECTORS } from './connectors'

if (
  !process.env.REACT_APP_WEB3_MODAL_PROJECT_ID ||
  !process.env.REACT_APP_WEB3_AUTH_PROJECT_ID ||
  !process.env.REACT_APP_WEB3_AUTH_NETWORK
) {
  throw new Error('Missing Web3Auth and/or WalletConnect projectID env variables!')
}
export const SUPPORTED_CHAINS_BY_ENV = process.env.NODE_ENV === 'production' ? [polygon] : [polygonMumbai]
export const WEB3_MODAL_PROPS: ForgeWeb3ModalProps = {
  appName: 'PASTELLE SHOP',
  chains: SUPPORTED_CHAINS_BY_ENV,
  options: {
    autoConnect: false,
    pollingInterval: 60_000,
  },
  connectors: CONNECTORS,
  modals: {
    root: {
      title: 'LOGIN PASTELLE',
      hideInjectedFromRoot: true,
      closeModalOnConnect: true,
      themeConfig: {
        theme: MODAL_THEME,
        mode: 'DEFAULT',
      },
      connectorDisplayOverrides: {
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
      loaderProps: {
        fontSize: '2.2em',
        spinnerProps: {
          size: 85,
          filter: 'invert(1) saturate(0.6) hue-rotate(306deg) brightness(2)',
        },
      },
    },
    walletConnect: {
      projectId: process.env.REACT_APP_WEB3_MODAL_PROJECT_ID,
      themeMode: 'dark',
      themeVariables: {
        '--w3m-background-color': pastelleTheme.blackOpaque,
        '--w3m-accent-color': '#9a7be5db',
        '--w3m-accent-fill-color': pastelleTheme.black,
        // TODO: either host image on IK and call using params to set height/width
        // TODO: OR just save a formatted image W x H somewhere here
        '--w3m-background-image-url':
          'https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-100,w-358,q-40,bl-5,e-grayscale',
        '--w3m-color-bg-1': pastelleTheme.blackOpaque,
        '--w3m-color-fg-1': pastelleTheme.offwhiteOpaqueMore,
        '--w3m-color-bg-2': '#463866',
      },
    },
  },
}
