import { CatalogSeasonsMap } from './types'
// APPAREL DATA
import VIRGIL from 'mock/apparel/virgil'
import ELLEX from 'mock/apparel/ellex'
import WITCH from 'mock/apparel/witch'
import ASCII from 'mock/apparel/ascii'

const catalogItems: Map<number | string, Partial<CatalogSeasonsMap>> = new Map()

catalogItems.set('2022', {
  FALL: {
    VIRGIL,
    ELLEX,
    WITCH,
    ASCII
  }
})

export default catalogItems
