import { CatalogSeasonItemMap, CatalogSeasonsMap } from './types'
import { buildItemParams } from 'mock/apparel/utils'

import * as FALL_CATALOG_INFO from 'mock/apparel/2022/FALL'

const FALL_CATALOG = Object.entries(FALL_CATALOG_INFO).reduce((acc, [itemName, itemContent]) => {
  acc[itemName] = buildItemParams(itemContent)
  return acc
}, {} as CatalogSeasonItemMap)

const catalogItems: Map<number | string, Partial<CatalogSeasonsMap>> = new Map()

catalogItems.set('2022', {
  FALL: FALL_CATALOG
})

export default catalogItems
