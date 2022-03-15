import { CatalogSeasonsMap } from './types'
// APPAREL DATA
import VIRGIL from 'mock/apparel/virgil'
import ELLEX from 'mock/apparel/ellex'
import VOODOO from 'mock/apparel/voodoo'
import REBIRTH from 'mock/apparel/rebirth'

const catalogItems: Map<number | string, Partial<CatalogSeasonsMap>> = new Map()

catalogItems.set('2022', {
  FALL: {
    VIRGIL,
    ELLEX,
    VOODOO,
    REBIRTH
  }
})

export default catalogItems
