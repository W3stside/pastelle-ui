const ETHERSCAN_PREFIXES: { [chainId: number]: string } = {
  1: '',
  5: 'goerli.',
  100: 'gnosischain.',
  80001: 'mumbai.',
}

export function getEtherscanLink(
  chainId: number,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

const WEB3_ENABLED_LOCAL_STORAGE_KEY = 'PASTELLE_ENABLE_BLOCKCHAIN'
export function isWeb3Enabled() {
  const preParse = localStorage.getItem(WEB3_ENABLED_LOCAL_STORAGE_KEY)
  const enableBc = Boolean(preParse && JSON.parse(preParse) === true)

  return enableBc
}
