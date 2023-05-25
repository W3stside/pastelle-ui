import { ForgeW3CoreProvidersProps } from '@past3lle/skillforge-web3'
import { goerli, polygonMumbai } from 'wagmi/chains'

if (!process.env.REACT_APP_WEB3_MODAL_PROJECT_ID || !process.env.REACT_APP_WEB3_AUTH_PROJECT_ID) {
  throw new Error('Missing W3A and/or W3M projectID env variables!')
}

export const WEB3_MODAL_PROPS: ForgeW3CoreProvidersProps['config']['web3'] = {
  chains: [goerli, polygonMumbai],
  modals: {
    pstl: {
      title: 'LOGIN TO PASTELLE.SHOP',
      closeModalOnConnect: true,
    },
    w3a: {
      appName: 'PASTELLE.SHOP',
      network: 'testnet',
      projectId: process.env.REACT_APP_WEB3_AUTH_PROJECT_ID,
    },
    w3m: {
      projectId: process.env.REACT_APP_WEB3_MODAL_PROJECT_ID,
    },
  },
}
