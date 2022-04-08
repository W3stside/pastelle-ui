import { CURRENT_SEASON, CURRENT_YEAR } from 'constants/config'
import { CatalogSeason } from 'mock/apparel/types'

type ItemUrlProps = { year?: string | number; season?: CatalogSeason; identifier: string }
export function buildItemUrl({ year = CURRENT_YEAR, season = CURRENT_SEASON, identifier }: ItemUrlProps) {
  // TODO: reenable itemKey
  // return `/goods/${year}/${season}/${identifier}`
  return `/goods/${year}/${season}/${identifier}`
}
