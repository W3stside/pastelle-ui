import { CatalogSeasonsMap } from './types'
// APPAREL DATA
import VIRGIL from 'mock/apparel/virgil'
import ELLEX from 'mock/apparel/ellex'
import VOODOO from 'mock/apparel/voodoo'
import ASCII from 'mock/apparel/ascii'

const catalogItems: Map<number | string, Partial<CatalogSeasonsMap>> = new Map()

catalogItems.set('2022', {
  FALL: {
    VIRGIL,
    ELLEX,
    VOODOO,
    ASCII
  }
})

export default catalogItems
