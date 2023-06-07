import { ForgeContractAddressMap } from '@past3lle/forge-web3'
import { Address } from 'wagmi'

import CONTRACTS_NETWORKS from '../forge/forge-networks.json'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP
export const CONTRACT_ADDRESSES_MAP: ForgeContractAddressMap = {
  [5]: {
    collectionsManager: CONTRACTS_NETWORKS[5].CollectionsManager.address as Address,
    mergeManager: '' as Address,
  },
  // TODO: fix - use proper mumbai addreses
  [80001]: {
    collectionsManager: CONTRACTS_NETWORKS[5].CollectionsManager.address as Address,
    mergeManager: '' as Address,
  },
}
