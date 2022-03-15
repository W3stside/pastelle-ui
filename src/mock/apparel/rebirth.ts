import { nanoid } from '@reduxjs/toolkit'
// misc
import { ApparelItem, BaseCatalogItem, CatalogItem } from './types'
import { buildUrl } from './utils'

const PARAMS: BaseCatalogItem = {
  name: 'REBIRTH',
  color: '#212121',
  season: 'FALL',
  year: 2022
}

// APPAREL URLS
// IMAGES
const BACK_IMAGE = 'back-large_u9WOujqHc.png'
const FRONT_IMAGE = 'front-large_Xp_n4aZ6fdS.png'
// VIDEO
const BACK_VIDEO = 'back_W76cqDjaR.webm'
const FRONT_VIDEO = 'front_qNOpNgd2z.webm'

const ITEM_MEDIA_LIST: ApparelItem[] = [
  // FRONT CONTENT
  {
    imageMedia: { path: buildUrl(PARAMS, 'IMAGES', FRONT_IMAGE), large: 2000, small: 500 },
    videoMedia: { path: buildUrl(PARAMS, 'VIDEOS', FRONT_VIDEO), lowq: 'q-10' }
  },
  // BACK CONTENT
  {
    imageMedia: { path: buildUrl(PARAMS, 'IMAGES', BACK_IMAGE), large: 2000, small: 500 },
    videoMedia: { path: buildUrl(PARAMS, 'VIDEOS', BACK_VIDEO), lowq: 'q-10' }
  }
]
const ITEM_SIZES_LIST = ['LARGE', 'MEDIUM', 'SMALL']
const ITEM_DESCRIPTION = [`Rebirth.`, `...`, `Home grown in LX @ pastelle labs`]

export default {
  itemColor: PARAMS.color,
  itemHeader: PARAMS.name,
  itemMediaList: ITEM_MEDIA_LIST,
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  key: PARAMS.name + '-' + nanoid()
} as CatalogItem
