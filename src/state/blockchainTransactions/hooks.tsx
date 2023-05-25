import { useW3Connection } from '@past3lle/skillforge-web3'
import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'state'

import { AddTransactionParams, HashType, TransactionDetails, addTransaction, clearAllTransactions } from './reducer'

export type AddTransactionHookParams = Omit<AddTransactionParams, 'chainId' | 'from' | 'hashType'> // The hook requires less params for convenience
export type TransactionAdder = (params: AddTransactionHookParams) => void

export function useAddTransaction() {
  const dispatch = useAppDispatch()

  return useCallback((payload: Parameters<typeof addTransaction>[0]) => dispatch(addTransaction(payload)), [dispatch])
}

export function useClearAllTransactions() {
  const dispatch = useAppDispatch()

  return useCallback(
    (payload: Parameters<typeof clearAllTransactions>[0]) => dispatch(clearAllTransactions(payload)),
    [dispatch]
  )
}

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): TransactionAdder {
  const [, , { chain, address: account }] = useW3Connection()
  const addTransaction = useAddTransaction()
  // TODO: fix this when we have safe app
  // const isGnosisSafeWallet = false

  return useCallback(
    (addTransactionParams: AddTransactionHookParams) => {
      if (!account || !chain?.id) return

      const { hash, summary, data, approval, presign, safeTransaction } = addTransactionParams
      const hashType = /* isGnosisSafeWallet ? HashType.GNOSIS_SAFE_TX : */ HashType.ETHEREUM_TX
      if (!hash) {
        throw Error('No transaction hash found')
      }

      addTransaction({
        hash,
        hashType,
        from: account,
        chainId: chain.id,
        approval,
        summary,
        data,
        presign,
        safeTransaction,
      })
    },
    [account, chain, addTransaction]
  )
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const [, , { chain }] = useW3Connection()

  const state = useAppSelector((state) => state.blockchainTransactions)

  return chain?.id ? state[chain.id] ?? {} : {}
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions()

  if (!transactionHash || !transactions[transactionHash]) return false

  return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress: string | undefined, spender: string | undefined): boolean {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const approval = tx.approval
          if (!approval) return false
          return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
        }
      }),
    [allTransactions, spender, tokenAddress]
  )
}
