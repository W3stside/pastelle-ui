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
export type CatalogSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'
export type CatalogItem = ItemPageProps & { key: string }
export type CatalogSeasonsMap = {
  [key in CatalogSeason]: {
    [item: string]: CatalogItem
  }
}
export type CatalogItemsMap = {
  [year: string]: Partial<CatalogSeasonsMap>
}
