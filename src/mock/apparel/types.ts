import { ItemPageProps } from 'pages/SingleItem/AsideWithVideo'

export enum SocialType {
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  DEVIANTART = 'DEVIANTART',
  DRIBBBLE = 'DRIBBBLE',
  BEHANCE = 'BEHANCE'
}

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
export type CatalogItem = ItemPageProps & { season: CatalogSeason; key: string }
// returns { ITEM_NAME: ITEM_OBJECT }
export type CatalogSeasonItemMap = {
  [item: string]: CatalogItem
}
// returns { SEASON_NAME: MAP_OF_ITEMS }
export type CatalogSeasonsMap = {
  [key in CatalogSeason]: CatalogSeasonItemMap | undefined
}
export type CatalogItemsMap = {
  [year: string]: Partial<CatalogSeasonsMap>
}
