import { nanoid } from '@reduxjs/toolkit'
// IMAGES
import FRONT_IMAGE_LARGE from 'assets/apparel/ellex/images/front-large.png'
import BACK_IMAGE_LARGE from 'assets/apparel/ellex/images/back-large.png'
import FRONT_IMAGE_SMALL from 'assets/apparel/ellex/images/front-small.png'
import BACK_IMAGE_SMALL from 'assets/apparel/ellex/images/back-small.png'
// VIDEO
import BACK_VIDEO from 'assets/apparel/ellex/video/front.webm'
import FRONT_VIDEO from 'assets/apparel/ellex/video/back.webm'
import FRONT_VIDEO_POSTER from 'assets/apparel/ellex/video/front-poster-lq.jpg'
import BACK_VIDEO_POSTER from 'assets/apparel/ellex/video/back-poster-lq.jpg'
// misc
import { ApparelItem, CatalogItem } from './types'
import { SocialType } from './types'

const ITEM_MEDIA_LIST: ApparelItem[] = [
  // FRONT CONTENT
  {
    imageMedia: { large: FRONT_IMAGE_LARGE, small: FRONT_IMAGE_SMALL },
    videoMedia: { video: FRONT_VIDEO, poster: FRONT_VIDEO_POSTER }
  },
  // BACK CONTENT
  {
    imageMedia: { large: BACK_IMAGE_LARGE, small: BACK_IMAGE_SMALL },
    videoMedia: { video: BACK_VIDEO, poster: BACK_VIDEO_POSTER }
  }
]
const ITEM_SIZES_LIST = ['LARGE', 'MEDIUM', 'SMALL']
const ITEM_DESCRIPTION = [`LADY ESTRELA. LEFT. ALONE.`, `Home grown in LX. @full_flex`]

const COLLABORATOR = 'Felix Lutsch'
const COLLABORATOR_SOCIAL = [
  { type: SocialType.INSTAGRAM, url: 'https://instagram.com/full_flex', display: '@full_flex' }
]

const itemName = 'ELLEX'

export default {
  itemColor: '#dbbbb9',
  itemHeader: itemName,
  itemMediaList: ITEM_MEDIA_LIST.reverse(),
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  itemArtistInfo: {
    artist: COLLABORATOR,
    social: COLLABORATOR_SOCIAL
  },
  key: itemName + '-' + nanoid()
} as CatalogItem
