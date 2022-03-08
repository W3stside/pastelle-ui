import { nanoid } from '@reduxjs/toolkit'
// IMAGES
import FRONT_IMAGE_LARGE from 'assets/apparel/estrela/images/front-large.jpg'
import BACK_IMAGE_LARGE from 'assets/apparel/estrela/images/back-large.jpg'
import FRONT_IMAGE_SMALL from 'assets/apparel/estrela/images/front-small.jpg'
import BACK_IMAGE_SMALL from 'assets/apparel/estrela/images/back-small.jpg'
// VIDEO
import BACK_VIDEO from 'assets/apparel/leer/video/front.webm'
import FRONT_VIDEO from 'assets/apparel/leer/video/back.webm'
import FRONT_VIDEO_POSTER from 'assets/apparel/leer/video/front-poster-lq.jpg'
import BACK_VIDEO_POSTER from 'assets/apparel/leer/video/back-poster-lq.jpg'
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
const ITEM_DESCRIPTION = `
Motivated by the fresh smell of street spilled, slightly warm, Sagres beer from the night before, our very own co-founder Felix Lutsch, aka "Lone Tree", found inspiration in the armless and legless bust of Lady Estrela.

Home grown in LX.
@full_flex
`

const COLLABORATOR = 'Felix Lutsch'
const COLLABORATOR_SOCIAL = [
  { type: SocialType.INSTAGRAM, url: 'https://instagram.com/full_flex', display: '@full_flex' }
]

export default {
  itemColor: '#dbbbb9',
  itemHeader: 'ESTRELA',
  itemMediaList: ITEM_MEDIA_LIST,
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  itemArtistInfo: {
    artist: COLLABORATOR,
    social: COLLABORATOR_SOCIAL
  },
  key: 'ESTRELA-' + nanoid()
} as CatalogItem
