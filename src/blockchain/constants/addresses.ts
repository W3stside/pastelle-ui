import { Address } from 'viem'

import CONTRACTS_NETWORKS from '../forge/forge-networks.json'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP
export const CONTRACT_ADDRESSES_MAP = {
  [5]: {
    collectionsManager: CONTRACTS_NETWORKS[5].CollectionsManager.address as Address,
    mergeManager: '' as Address,
  },
  [137]: {
    collectionsManager: CONTRACTS_NETWORKS[137].CollectionsManager.address as Address,
    mergeManager: '' as Address,
  },
  [80001]: {
    collectionsManager: CONTRACTS_NETWORKS[80001].CollectionsManager.address as Address,
    mergeManager: '' as Address,
  },
}
