import { CustomIpfsGatewayConfig } from '@past3lle/skillforge-web3'

export const IPFS_GATEWAY_URI_MAP = {
  PINATA: 'https://gateway.pinata.cloud/ipfs',
  INFURA: 'https://infura-ipfs.io/ipfs',
  PASTELLE_INFURA: 'https://pastelle.infura-ipfs.io/ipfs',
  DEFAULT_IPFS: 'https://ipfs.io/ipfs',
}

export const GATEWAY_URIS: CustomIpfsGatewayConfig[] = [
  {
    gateway: IPFS_GATEWAY_URI_MAP.PASTELLE_INFURA,
  },
  {
    gateway: IPFS_GATEWAY_URI_MAP.DEFAULT_IPFS,
  },
]
