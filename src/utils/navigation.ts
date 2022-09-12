import { CURRENT_DROP } from 'constants/config'
import { CATALOG_PATHNAME } from 'constants/navigation'
import { Location } from 'history'

type ItemUrlProps = { drop?: string | number; identifier: string }
export function buildItemUrl({ drop = CURRENT_DROP, identifier }: ItemUrlProps) {
  // TODO: reenable itemKey
  return `/drop-${drop}/${identifier}`
}

export function checkIsCatalogPage(location: Location) {
  return location.pathname === CATALOG_PATHNAME
}
