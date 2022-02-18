import { nanoid } from '@reduxjs/toolkit'
import FRONT_IMAGE_LARGE from 'assets/apparel/leer/images/front-large.jpg'
import BACK_IMAGE_LARGE from 'assets/apparel/leer/images/back-large.jpg'
import FRONT_IMAGE_SMALL from 'assets/apparel/leer/images/front-small.jpg'
import BACK_IMAGE_SMALL from 'assets/apparel/leer/images/back-small.jpg'
import FRONT_VIDEO from 'assets/apparel/leer/video/front.webm'
import BACK_VIDEO from 'assets/apparel/leer/video/back.webm'
import FRONT_VIDEO_POSTER from 'assets/apparel/leer/video/front-poster-lq.jpg'
import BACK_VIDEO_POSTER from 'assets/apparel/leer/video/back-poster-lq.jpg'
import { ApparelItem, CatalogItem } from './types'
import { SocialType } from 'pages/SingleItem/AsideWithVideo'

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
const ITEM_DESCRIPTION = `
Virgil didnt make it through 7 layers of hell and write about it for you to not buy this shirt. 

E io ch’avea d’error la testa cinta,
dissi: Maestro, che è quel ch’i’ odo?
e che gent’ è che par nel duol sì vinta?

Big shout to Mathieu Sato in Bordeaux for the painting on the front.
@mathieusato
`

const COLLABORATOR = 'Mathieu Sato'
const COLLABORATOR_SOCIAL = [
  { type: SocialType.INSTAGRAM, url: 'https://instagram.com/mathieusato', display: '@mathieusato' }
]

export default {
  itemColor: '#a2c2fa',
  itemHeader: 'L E E R',
  itemMediaList: ITEM_MEDIA_LIST,
  itemSizesList: ITEM_SIZES_LIST,
  itemDescription: ITEM_DESCRIPTION,
  itemArtistInfo: {
    artist: COLLABORATOR,
    social: COLLABORATOR_SOCIAL
  },
  key: nanoid()
} as CatalogItem
