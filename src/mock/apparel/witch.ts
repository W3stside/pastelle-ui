import { nanoid } from '@reduxjs/toolkit'
// IMAGES
import FRONT_IMAGE_LARGE from 'assets/apparel/witch/images/front-large.jpg'
import BACK_IMAGE_LARGE from 'assets/apparel/witch/images/back-large.jpg'
import FRONT_IMAGE_SMALL from 'assets/apparel/witch/images/front-small.jpg'
import BACK_IMAGE_SMALL from 'assets/apparel/witch/images/back-small.jpg'
// VIDEO
import BACK_VIDEO from 'assets/apparel/witch/video/front.webm'
import FRONT_VIDEO from 'assets/apparel/witch/video/back.webm'
import FRONT_VIDEO_POSTER from 'assets/apparel/witch/video/front-poster-lq.jpg'
import BACK_VIDEO_POSTER from 'assets/apparel/witch/video/back-poster-lq.jpg'
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

const itemName = 'WITCH'

export default {
  itemColor: '#8f55e999',
  itemHeader: itemName,
  itemMediaList: ITEM_MEDIA_LIST.reverse(),
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  itemArtistInfo: undefined,
  key: itemName + '-' + nanoid()
} as CatalogItem
