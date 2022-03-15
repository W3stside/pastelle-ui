import { nanoid } from '@reduxjs/toolkit'

// misc
import { ApparelItem, CatalogItem, BaseCatalogItem } from './types'
import { buildUrl } from './utils'

const PARAMS: BaseCatalogItem = {
  name: 'VOODOO',
  color: '#8f55e999',
  season: 'FALL',
  year: 2022
}

// APPAREL URLS
const LOGO = 'logo_So9mIc7n7.png'
// IMAGES
const BACK_IMAGE = 'back-large_kT9xjz8Jk.png'
const FRONT_IMAGE = 'front-large_3AJd4v3s-mU.png'
// VIDEO
const BACK_VIDEO = 'back_W76cqDjaR.webm'
const FRONT_VIDEO = 'front_qNOpNgd2z.webm'

const ITEM_MEDIA_LIST: ApparelItem[] = [
  // FRONT CONTENT
  {
    imageMedia: { path: buildUrl(PARAMS, 'IMAGES', FRONT_IMAGE), large: 2000, small: 500 },
    videoMedia: { path: buildUrl(PARAMS, 'VIDEOS', FRONT_VIDEO), lowq: '?tr=q-10' }
  },
  // BACK CONTENT
  {
    imageMedia: { path: buildUrl(PARAMS, 'IMAGES', BACK_IMAGE), large: 2000, small: 500 },
    videoMedia: { path: buildUrl(PARAMS, 'VIDEOS', BACK_VIDEO), lowq: '?tr=q-10' }
  }
]
const ITEM_SIZES_LIST = ['LARGE', 'MEDIUM', 'SMALL']
const ITEM_DESCRIPTION = [
  `1500uG +`,
  `Phasing in and out. Fractals? Reality? Who am I, really?`,
  `Home grown in LX @ pastelle labs`
]

export default {
  itemColor: PARAMS.color,
  itemHeader: PARAMS.name,
  itemLogo: buildUrl(PARAMS, 'IMAGES', LOGO),
  itemMediaList: ITEM_MEDIA_LIST.reverse(),
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  itemArtistInfo: undefined,
  key: PARAMS.name + '-' + nanoid()
} as CatalogItem
