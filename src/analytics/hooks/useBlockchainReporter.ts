import { useW3Connection } from '@past3lle/forge-web3'
import { useEffect } from 'react'
import { blockchainAccountAnalytics, blockchainChainAnalytics } from '../events/blockchainEvents'

export function useBlockchainAnalyticsReporter() {
  // Handle chain id custom dimension
  const [, , { address: account, currentConnector: connector, chain }] = useW3Connection()
  useEffect(() => {
    // custom dimension 1 - chainId
    blockchainChainAnalytics(chain?.id)
  }, [chain?.id])
  // Handle wallet name custom dimension
  //   const walletInfo = useWalletInfo()
  //   const connection = getConnection(connector)
  const walletName = connector?.name
  useEffect(() => {
    // custm dimension 2 - walletname
    blockchainAccountAnalytics(walletName || 'web3_disconnected')
  }, [account, walletName])
}
