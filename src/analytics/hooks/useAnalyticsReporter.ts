import { useWeb3React } from '@web3-react/core'
import { getConnection, getConnectionName, getIsMetaMask } from 'blockchain/connectors'
import { useWalletInfo } from 'blockchain/hooks/useWalletInfo'
import { useEffect } from 'react'
import { Location } from 'react-router-dom'
import { Metric, getCLS, getFCP, getFID, getLCP } from 'web-vitals'

import { GOOGLE_ANALYTICS_CLIENT_ID_STORAGE_KEY, googleAnalytics } from '..'
import { Dimensions } from '../GoogleAnalytics4Provider'

export function sendTiming(timingCategory: any, timingVar: any, timingValue: any, timingLabel: any) {
  return googleAnalytics.gaCommandSendTiming(timingCategory, timingVar, timingValue, timingLabel)
}

function sendWebVitals({ name, delta, id }: Metric) {
  sendTiming('Web Vitals', name, Math.round(name === 'CLS' ? delta * 1000 : delta), id)
}

export function reportWebVitals() {
  getFCP(sendWebVitals)
  getFID(sendWebVitals)
  getLCP(sendWebVitals)
  getCLS(sendWebVitals)
}

export function initGATracker() {
  // typed as 'any' in react-ga4 -.-
  googleAnalytics.ga((tracker: any) => {
    if (!tracker) return

    const clientId = tracker.get('clientId')
    window.localStorage.setItem(GOOGLE_ANALYTICS_CLIENT_ID_STORAGE_KEY, clientId)
  })
}

export function useBlockchainAnalyticsReporter() {
  // Handle chain id custom dimension
  const { chainId, connector, account } = useWeb3React()
  useEffect(() => {
    // custom dimension 1 - chainId
    googleAnalytics.setDimension(Dimensions.chainId, chainId)
  }, [chainId])

  // Handle wallet name custom dimension
  const walletInfo = useWalletInfo()
  const connection = getConnection(connector)
  const isMetaMask = getIsMetaMask()

  const walletName = walletInfo?.walletName || getConnectionName(connection.type, isMetaMask)

  useEffect(() => {
    // custom dimension 2 - walletname
    googleAnalytics.setDimension(Dimensions.walletName, account ? walletName : 'Not connected')
  }, [account, walletName])
}

// tracks web vitals and pageviews
export function useAnalyticsReporter({ pathname, search }: Location) {
  useBlockchainAnalyticsReporter()

  useEffect(() => {
    googleAnalytics.pageview(`${pathname}${search}`)
  }, [pathname, search])

  useEffect(() => {
    reportWebVitals()
    initGATracker()
  }, [])
}
