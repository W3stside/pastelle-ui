import { nanoid } from '@reduxjs/toolkit'
// IMAGES
import FRONT_IMAGE_LARGE from 'assets/apparel/voodoo/images/front-large.png'
import BACK_IMAGE_LARGE from 'assets/apparel/voodoo/images/back-large.png'
import FRONT_IMAGE_SMALL from 'assets/apparel/voodoo/images/front-small.png'
import BACK_IMAGE_SMALL from 'assets/apparel/voodoo/images/back-small.png'
import LOGO from 'assets/apparel/voodoo/images/logo.png'
// VIDEO
import BACK_VIDEO from 'assets/apparel/voodoo/video/front.webm'
import FRONT_VIDEO from 'assets/apparel/voodoo/video/back.webm'
import FRONT_VIDEO_POSTER from 'assets/apparel/voodoo/video/front-poster-lq.jpg'
import BACK_VIDEO_POSTER from 'assets/apparel/voodoo/video/back-poster-lq.jpg'
// misc
import { ApparelItem, CatalogItem } from './types'
// import { SocialType } from './types'

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
const ITEM_DESCRIPTION = [
  `1500uG +`,
  `Phasing in and out. Fractals? Reality? Who am I, really?`,
  `Home grown in LX @ pastelle labs`
]

const itemName = 'VOODOO'

export default {
  itemColor: '#8f55e999',
  itemHeader: itemName,
  itemLogo: LOGO,
  itemMediaList: ITEM_MEDIA_LIST.reverse(),
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  itemArtistInfo: undefined,
  key: itemName + '-' + nanoid()
} as CatalogItem
