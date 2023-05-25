import { ForgeW3Providers } from '@past3lle/skillforge-web3'
import { ReactNode } from 'react'

import { CONTRACT_ADDRESSES_MAP } from '../constants/addresses'
import { GATEWAY_URIS } from '../constants/ipfs'
import { METADATA_URIS_MAP } from '../constants/metadata'
import { WEB3_MODAL_PROPS } from './config'

export function PastelleForgeW3Provider({ children }: { children: ReactNode }) {
  return (
    <ForgeW3Providers
      config={{
        name: 'PASTELLE.SHOP',
        web3: WEB3_MODAL_PROPS,
        contractAddresses: CONTRACT_ADDRESSES_MAP,
        metadataUris: METADATA_URIS_MAP,
        skillOptions: {
          idBase: 1000,
          metadataFetchOptions: {
            gatewayUris: GATEWAY_URIS,
          },
        },
      }}
    >
      {children}
    </ForgeW3Providers>
  )
}
