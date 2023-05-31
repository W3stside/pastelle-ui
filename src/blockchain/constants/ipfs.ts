import { CustomIpfsGatewayConfig } from '@past3lle/skillforge-web3'

export const IPFS_GATEWAY_URI_MAP = {
  PINATA: 'https://gateway.pinata.cloud',
  INFURA: 'https://infura-ipfs.io',
  PASTELLE_INFURA: 'https://pastelle.infura-ipfs.io',
  DEFAULT_IPFS: 'https://ipfs.io',
}

export const GATEWAY_URIS: CustomIpfsGatewayConfig[] = [
  {
    gateway: IPFS_GATEWAY_URI_MAP.PASTELLE_INFURA,
  },
  {
    gateway: IPFS_GATEWAY_URI_MAP.DEFAULT_IPFS,
  },
]
