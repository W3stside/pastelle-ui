import { BaseProductPageProps, ItemPageDesignsProps } from '@/pages/common/types'

export enum SocialType {
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  DEVIANTART = 'DEVIANTART',
  DRIBBBLE = 'DRIBBBLE',
  BEHANCE = 'BEHANCE',
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
export type CollectionSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'
export type CollectionItem = BaseProductPageProps & ItemPageDesignsProps
// returns { ITEM_NAME: ITEM_OBJECT }
export type CollectionSeasonItemMap = {
  [item: string]: CollectionItem
}
// returns { SEASON_NAME: MAP_OF_ITEMS }
export type CollectionSeasonsMap = {
  [key in CollectionSeason]: CollectionSeasonItemMap | undefined
}
export type CollectionItemsMap = {
  [year: string]: Partial<CollectionSeasonsMap>
}
export type BaseCollectionItem = {
  year: number | string
  season: CollectionSeason
  name: string
  color: string
}

export type CollaboratorSocialData = { type: SocialType; url: string; display: string }[]

export type ItemSizes = 'XX-LARGE' | 'X-LARGE' | 'LARGE' | 'MEDIUM' | 'SMALL'
export type ItemMetadata = BaseCollectionItem & {
  description: string[]
  collaborator?: string
  social?: CollaboratorSocialData
}
export type ItemMetaDataOptions = { reverseMediaOrder?: boolean; imageExtension?: string }

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
