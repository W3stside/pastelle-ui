import { ForgeWeb3ModalProps } from '@past3lle/forge-web3'
import { pstlModalTheme as MODAL_THEME, pastelleTheme } from 'theme'
import { goerli, polygon, polygonMumbai } from 'wagmi/chains'

if (!process.env.REACT_APP_WEB3_MODAL_PROJECT_ID || !process.env.REACT_APP_WEB3_AUTH_PROJECT_ID) {
  throw new Error('Missing W3A and/or W3M projectID env variables!')
}

export const WEB3_MODAL_PROPS: ForgeWeb3ModalProps = {
  appName: 'PASTELLE SHOP',
  chains: [goerli, polygon, polygonMumbai],
  wagmiClient: {
    options: {
      pollingInterval: 30_000,
    },
  },
  modals: {
    pstl: {
      title: 'LOGIN    PASTELLE.SHOP',
      closeModalOnConnect: true,
      themeConfig: {
        theme: MODAL_THEME,
        mode: 'DEFAULT',
      },
      connectorDisplayOverrides: {
        web3auth: {
          isRecommended: true,
          customName: 'Email / SMS / Social',
        },
        walletConnect: {
          customName: 'Web3 Wallets',
        },
      },
    },
    w3a: {
      appName: 'PASTELLE.SHOP',
      network: process.env.NODE === 'production' ? 'mainnet' : 'testnet',
      projectId: process.env.REACT_APP_WEB3_AUTH_PROJECT_ID,
    },
    w3m: {
      projectId: process.env.REACT_APP_WEB3_MODAL_PROJECT_ID,
      themeVariables: {
        '--w3m-background-color': pastelleTheme.blackOpaque,
        '--w3m-accent-color': '#525291',
        '--w3m-accent-fill-color': pastelleTheme.modes.DEFAULT.purple,
        // TODO: either host image on IK and call using params to set height/width
        // TODO: OR just save a formatted image W x H somewhere here
        '--w3m-background-image-url':
          'https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-100,w-358,q-40,bl-5,e-grayscale',
        '--w3m-color-bg-1': pastelleTheme.blackOpaque,
        '--w3m-color-fg-1': pastelleTheme.offwhiteOpaqueMore,
      },
    },
  },
}
