import { ForgeW3Providers, overwriteWeb3PropsWithOuterTheme } from '@past3lle/forge-web3'
import { ReactNode, useMemo } from 'react'
import { useTheme } from 'styled-components'

import { CONTRACT_ADDRESSES_MAP } from '../constants/addresses'
import { GATEWAY_URIS } from '../constants/ipfs'
import { METADATA_URIS_MAP } from '../constants/metadata'
import { WEB3_MODAL_PROPS } from './config'
import { FORGE_WEB3_ENABLED } from '@/constants/flags'

export function PastelleForgeW3Provider({ children }: { children: ReactNode }) {
  const pastelleTheme = useTheme()

  const web3 = useMemo(() => overwriteWeb3PropsWithOuterTheme(WEB3_MODAL_PROPS, pastelleTheme), [pastelleTheme])

  if (!FORGE_WEB3_ENABLED) return children

  return (
    <ForgeW3Providers
      config={{
        name: 'PASTELLE.SHOP',
        contactInfo: {
          email: 'shop@pastelle.shop',
        },
        web3,
        contractAddresses: CONTRACT_ADDRESSES_MAP,
        metadataUris: METADATA_URIS_MAP,
        skillOptions: {
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
