import { useEffect } from 'react'

import packageJSON from '../../../package.json'

export function VersionUpdater() {
  useEffect(() => {
    const currentVersion = localStorage.getItem('PASTELLE_SHOP_VERSION')
    if (currentVersion !== packageJSON.version) {
      localStorage.removeItem('redux_localstorage_simple_collection')
      localStorage.removeItem('redux_localstorage_simple_cart')

      localStorage.setItem('PASTELLE_SHOP_VERSION', packageJSON.version)
      window.location.reload()
    }
  }, [])

  return null
}
