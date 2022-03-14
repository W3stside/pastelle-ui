import { nanoid } from '@reduxjs/toolkit'
import FRONT_IMAGE_LARGE from 'assets/apparel/virgil/images/front-large.png'
import BACK_IMAGE_LARGE from 'assets/apparel/virgil/images/back-large.png'
import FRONT_IMAGE_SMALL from 'assets/apparel/virgil/images/front-small.png'
import BACK_IMAGE_SMALL from 'assets/apparel/virgil/images/back-small.png'
import FRONT_VIDEO from 'assets/apparel/virgil/video/front.webm'
import BACK_VIDEO from 'assets/apparel/virgil/video/back.webm'
import FRONT_VIDEO_POSTER from 'assets/apparel/virgil/video/front-poster-lq.jpg'
import BACK_VIDEO_POSTER from 'assets/apparel/virgil/video/back-poster-lq.jpg'
import { ApparelItem, CatalogItem } from './types'
import { SocialType } from './types'

const ITEM_MEDIA_LIST: ApparelItem[] = [
  {
    imageMedia: { large: FRONT_IMAGE_LARGE, small: FRONT_IMAGE_SMALL },
    videoMedia: { video: FRONT_VIDEO, poster: FRONT_VIDEO_POSTER }
  },
  {
    imageMedia: { large: BACK_IMAGE_LARGE, small: BACK_IMAGE_SMALL },
    videoMedia: { video: BACK_VIDEO, poster: BACK_VIDEO_POSTER }
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

const itemName = 'VIRGIL'

export default {
  itemColor: '#a2c2fa',
  itemHeader: itemName,
  itemMediaList: ITEM_MEDIA_LIST,
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  itemArtistInfo: {
    artist: COLLABORATOR,
    social: COLLABORATOR_SOCIAL
  },
  key: itemName + '-' + nanoid()
} as CatalogItem
