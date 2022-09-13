import { CATALOG_PATHNAME } from 'constants/navigation'
import { Location } from 'history'

export function buildItemUrl(handle: string) {
  // TODO: reenable itemKey
  return `/drop/${handle}`
}

export function checkIsCatalogPage(location: Location) {
  return location.pathname === CATALOG_PATHNAME
}
