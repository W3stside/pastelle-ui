import { ForgeW3Providers } from '@past3lle/forge-web3'
import { ReactNode, useMemo } from 'react'
import { useTheme } from 'styled-components/macro'

import { CONTRACT_ADDRESSES_MAP } from '../constants/addresses'
import { GATEWAY_URIS } from '../constants/ipfs'
import { METADATA_URIS_MAP } from '../constants/metadata'
import { WEB3_MODAL_PROPS } from './config'

export function PastelleForgeW3Provider({ children }: { children: ReactNode }) {
  const pastelleTheme = useTheme()

  const mutatedWeb3Props = useMemo(() => {
    if (!pastelleTheme?.mode || !WEB3_MODAL_PROPS.modals.pstl?.themeConfig) return WEB3_MODAL_PROPS

    WEB3_MODAL_PROPS.modals.pstl.themeConfig.mode = pastelleTheme.mode
    return WEB3_MODAL_PROPS
  }, [pastelleTheme?.mode])

  return (
    <ForgeW3Providers
      config={{
        name: 'PASTELLE.SHOP',
        web3: mutatedWeb3Props,
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
