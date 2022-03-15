import { nanoid } from '@reduxjs/toolkit'
import { ApparelItem, BaseCatalogItem, CatalogItem } from './types'
import { buildUrl } from './utils'

const PARAMS: BaseCatalogItem = {
  name: 'ELLEX',
  color: '#dbbbb9',
  season: 'FALL',
  year: 2022
}

// APPAREL URLS
// IMAGES
const BACK_IMAGE = 'back-large_664zvVTRG.png'
const FRONT_IMAGE = 'front-large_Cms4yOswP.png'
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
const ITEM_DESCRIPTION = [`LADY ESTRELA. LEFT. ALONE.`, `Home grown in LX. @full_flex`]

export default {
  itemColor: PARAMS.color,
  itemHeader: PARAMS.name,
  itemLogo: undefined,
  itemMediaList: ITEM_MEDIA_LIST.reverse(),
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  itemArtistInfo: undefined,
  key: PARAMS.name + '-' + nanoid()
} as CatalogItem
