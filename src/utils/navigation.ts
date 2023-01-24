import { COLLECTION_PARAM_NAME, COLLECTION_PATHNAME } from 'constants/navigation'
import { Location } from 'history'

export function buildItemUrl(handle: string) {
  // TODO: reenable itemKey
  return `/${COLLECTION_PARAM_NAME}/${handle}`
}

export function checkIsCollectionPage(location: Location) {
  return location.pathname === COLLECTION_PATHNAME
}
