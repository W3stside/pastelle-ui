import { /* CatalogSeasonItemMap, */ CatalogSeasonsMap } from './types'

import * as FALL_CATALOG from 'mock/apparel/2022/FALL'

/* const CATALOG = Object.entries(FALL_CATALOG).reduce((acc, [itemName, itemContent]) => {
  acc[itemName] = itemContent
  return acc
}, {} as CatalogSeasonItemMap) */

const catalogItems: Map<number | string, Partial<CatalogSeasonsMap>> = new Map()

catalogItems.set('2022', {
  FALL: FALL_CATALOG
})

export default catalogItems
