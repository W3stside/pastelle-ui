import { nanoid } from '@reduxjs/toolkit'

import { ApparelItem, CatalogItem, BaseCatalogItem, SocialType } from './types'
import { buildUrl } from './utils'

const PARAMS: BaseCatalogItem = {
  name: 'VIRGIL',
  // itemColor: '#a2c2fa',
  color: '#427da2',
  season: 'FALL',
  year: 2022
}

// APPAREL URLS
const LOGO = 'logo__cCch4BKNb8.png'
// IMAGES
const BACK_IMAGE = 'back-large_DSW6FgIcg.png'
const FRONT_IMAGE = 'front-large_Z9l3Rr7SR.png'
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
const ITEM_DESCRIPTION = [
  `“And I — my head oppressed by horror — said: "Master, what is it that I hear? Who are those people so defeated by
  their pain?"`,
  `And he to me: "This miserable way is taken by the sorry souls of those who lived without disgrace and without
  praise. They now commingle with the coward angels, the company of those who were not rebels nor faithful to their
  God, but stood apart. The heavens, that their beauty not be lessened, have cast them out, nor will deep Hell
  receive them — even the wicked cannot glory in them.”`
]

const COLLABORATOR = 'Mathieu Sato'
const COLLABORATOR_SOCIAL = [
  { type: SocialType.INSTAGRAM, url: 'https://instagram.com/mathieusato', display: '@mathieusato' }
]

export default {
  itemColor: PARAMS.color,
  itemHeader: PARAMS.name,
  itemLogo: buildUrl(PARAMS, 'IMAGES', LOGO),
  itemMediaList: ITEM_MEDIA_LIST,
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  itemArtistInfo: {
    artist: COLLABORATOR,
    social: COLLABORATOR_SOCIAL
  },
  key: PARAMS.name + '-' + nanoid()
} as CatalogItem
