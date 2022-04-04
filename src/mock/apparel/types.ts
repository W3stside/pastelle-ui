import { ItemPageProps, ItemPageDesignsProps } from 'pages/SingleItem/AsideWithVideo'

export enum SocialType {
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  DEVIANTART = 'DEVIANTART',
  DRIBBBLE = 'DRIBBBLE',
  BEHANCE = 'BEHANCE'
}

export type ApparelItem = {
  imageMedia: {
    path: string
    large: string | number
    small: string | number
  }
  videoMedia: {
    path: string
    lowq: string
  }
}
export type CatalogSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'
export type CatalogItem = ItemPageProps & ItemPageDesignsProps
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
export type BaseCatalogItem = {
  year: number | string
  season: CatalogSeason
  name: string
  color: string
}

export type CollaboratorSocialData = { type: SocialType; url: string; display: string }[]

export type ItemSizes = 'XX-LARGE' | 'X-LARGE' | 'LARGE' | 'MEDIUM' | 'SMALL'
export type ItemMetadata = BaseCatalogItem & {
  description: string[]
  collaborator?: string
  social?: CollaboratorSocialData
}
export type ItemMetaDataOptions = { reverseMediaOrder?: boolean }

export type ItemMediaContent = {
  logo?: string
  images: {
    front: string
    back: string
  }
  videos: {
    front: string
    back: string
  }
}
