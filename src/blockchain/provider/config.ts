import { ForgeWeb3ModalProps } from '@past3lle/forge-web3'
import { pstlModalTheme as MODAL_THEME, pastelleTheme } from '@/theme'
import { polygon, polygonAmoy } from 'wagmi/chains'

import { CONNECTORS } from './connectors'

if (
  !process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_WEB3_AUTH_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_WEB3_AUTH_NETWORK
) {
  throw new Error('Missing Web3Auth and/or WalletConnect projectID env variables!')
}

// TODO: just fix this in the forge-web3 packet and make wagmi need to be latest
// this is an issue because wagmi/viem keeps updating their chains as const
// and forge-web3 allows a range of versions of wagmi but has a strict requirement on ForgeChainsMinimum
const polygonWrapped = {
  ...polygon,
  nativeCurrency: {
    ...polygon.nativeCurrency,
    name: 'MATIC',
    symbol: 'MATIC',
  },
} as const

export const SUPPORTED_CHAINS_BY_ENV =
  process.env.NODE_ENV === 'production' ? ([polygonWrapped] as const) : ([polygonAmoy] as const)
export const WEB3_MODAL_PROPS: ForgeWeb3ModalProps = {
  appName: 'PASTELLE SHOP',
  chains: SUPPORTED_CHAINS_BY_ENV,
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
      loaderProps: {
        fontSize: '2.2em',
        spinnerProps: {
          size: 85,
          filter: 'invert(1) saturate(0.6) hue-rotate(306deg) brightness(2)',
        },
      },
    },
    walletConnect: {
      projectId: process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID,
      themeMode: 'dark',
      themeVariables: {
        '--wcm-background-color': pastelleTheme.blackOpaque,
        '--wcm-accent-color': '#9a7be5db',
        '--wcm-accent-fill-color': pastelleTheme.black,
        // TODO: either host image on IK and call using params to set height/width
        // TODO: OR just save a formatted image W x H somewhere here
        // '--wcm-background-image-url':
        //   'https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-100,w-358,q-40,bl-5,e-grayscale',
        '--wcm-color-bg-1': pastelleTheme.blackOpaque,
        '--wcm-color-fg-1': pastelleTheme.offwhiteOpaqueMore,
        '--wcm-color-bg-2': '#463866',
      },
    },
  },
}
