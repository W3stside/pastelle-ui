import { nanoid } from '@reduxjs/toolkit'
import { SHIRT_SIZES, STORE_IMAGE_SIZES } from 'constants/config'
import { BaseCatalogItem, CatalogItem, ItemMediaContent, ItemMetadata } from './types'

export function buildUrl({ year, name, season }: BaseCatalogItem, type: 'VIDEOS' | 'IMAGES', id: string) {
  return `/APPAREL/${year}/${season}/${name}/${type}/${id}`
}

export function buildItemParams(params: ItemMetadata, media: ItemMediaContent): Omit<CatalogItem, 'season'> {
  return Object.assign(
    {},
    {
      itemColor: params.color,
      itemHeader: params.name,
      itemDescription: params.description,
      itemLogo: media.logo && buildUrl(params as BaseCatalogItem, 'IMAGES', media.logo),
      itemSizesList: SHIRT_SIZES,
      itemArtistInfo:
        params.collaborator && params.social
          ? {
              artist: params.collaborator,
              social: params.social
            }
          : undefined,
      key: params.name + '-' + nanoid()
    },
    {
      itemMediaList: [
        // FRONT CONTENT
        {
          imageMedia: {
            path: buildUrl(params, 'IMAGES', media.images.front),
            large: STORE_IMAGE_SIZES.LARGE,
            small: STORE_IMAGE_SIZES.SMALL
          },
          videoMedia: { path: buildUrl(params, 'VIDEOS', media.videos.front), lowq: 'q-10' }
        },
        // BACK CONTENT
        {
          imageMedia: {
            path: buildUrl(params, 'IMAGES', media.images.back),
            large: STORE_IMAGE_SIZES.LARGE,
            small: STORE_IMAGE_SIZES.SMALL
          },
          videoMedia: { path: buildUrl(params, 'VIDEOS', media.videos.back), lowq: 'q-10' }
        }
      ]
    }
  )
}
