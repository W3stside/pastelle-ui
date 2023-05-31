import { CONTRACTS_NETWORKS, SkillForgeContractAddressMap, SupportedChains } from '@past3lle/skillforge-web3'
import { Address } from 'wagmi'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP
export const CONTRACT_ADDRESSES_MAP: SkillForgeContractAddressMap = {
  [SupportedChains.GOERLI]: {
    collectionsManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].MergeManager.address as Address,
  },
  // TODO: fix - use proper mumbai addreses
  [SupportedChains.POLYGON_MUMBAI]: {
    collectionsManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].MergeManager.address as Address,
  },
}
