import { CatalogSeasonItemMap, CatalogSeasonsMap } from './types'
import { buildItemParams } from 'mock/apparel/utils'

import * as FALL_CATALOG_INFO from 'mock/apparel/2022/FALL'

const FALL_CATALOG = Object.values(FALL_CATALOG_INFO).reduce((acc, itemContent) => {
  const fullItem = buildItemParams(itemContent)
  // TODO: reenable itemKey
  // acc[fullItem.itemKey] = fullItem
  acc[fullItem.itemHeader] = fullItem
  return acc
}, {} as CatalogSeasonItemMap)

const catalogItems: Map<number | string, Partial<CatalogSeasonsMap>> = new Map()

catalogItems.set('2022', {
  FALL: FALL_CATALOG
})

export default catalogItems
