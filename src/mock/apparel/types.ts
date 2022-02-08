import { ItemPageProps } from 'pages/SingleItem/AsideWithVideo'

export type ApparelItem = {
  imageMedia: {
    large: string
    small: string
  }
  videoMedia: {
    video: string
    poster: string
  }
}
export type HomeItem = ItemPageProps & { key: string }
export type HomeItemsList = HomeItem[]
