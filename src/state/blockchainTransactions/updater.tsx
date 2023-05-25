import { useW3Connection } from '@past3lle/skillforge-web3'
import { devError } from '@past3lle/utils'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'state'
import { useAddTxPopup, useCheckedTransaction, useFinalizeTransaction } from 'state/modalsAndPopups/hooks'
import { useBlockNumber } from 'wagmi'

export function shouldCheck(
  lastBlockNumber: number,
  tx: { addedTime: number; receipt?: Record<any, any>; lastCheckedBlockNumber?: number }
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

export default function Updater(): null {
  const [provider, setLocalProvider] = useState<any>()
  const [, , { chain, currentConnector }] = useW3Connection()

  const { data: lastBlockNumber } = useBlockNumber()
  const state = useAppSelector((state) => state.blockchainTransactions)

  // show popup on confirm
  const addTxPopup = useAddTxPopup()
  const finalizeTransaction = useFinalizeTransaction()
  const checkedTransaction = useCheckedTransaction()

  useEffect(() => {
    currentConnector
      ?.getProvider({ chainId: chain?.id })
      .then((res) => setLocalProvider(res))
      .catch((error) => {
        devError('Error! BlockchainTransactionsUpdater', error)
      })
  }, [currentConnector, chain])

  useEffect(() => {
    if (!chain?.id || !provider || !lastBlockNumber) return

    const transactions = state[chain.id] ?? {}

    Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach((hash) => {
        provider
          ?.getTransactionReceipt(hash)
          .then((receipt: any) => {
            if (receipt) {
              finalizeTransaction({
                chainId: chain.id,
                hash,
                receipt: {
                  blockHash: receipt.blockHash,
                  blockNumber: receipt.blockNumber,
                  contractAddress: receipt.contractAddress,
                  from: receipt.from,
                  status: receipt.status,
                  to: receipt.to,
                  transactionHash: receipt.transactionHash,
                  transactionIndex: receipt.transactionIndex,
                },
              })

              addTxPopup(
                {
                  txn: {
                    hash,
                    success: receipt.status === 1,
                    summary: transactions[hash]?.summary,
                  },
                },
                hash
              )
            } else {
              checkedTransaction({ chainId: chain.id, hash, blockNumber: lastBlockNumber })
            }
          })
          .catch((error: any) => {
            devError(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chain, provider, lastBlockNumber, addTxPopup, state, finalizeTransaction, checkedTransaction])

  return null
}
