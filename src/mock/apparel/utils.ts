import { nanoid } from '@reduxjs/toolkit'
import { SHIRT_SIZES, STORE_IMAGE_SIZES } from 'constants/config'
import { BaseCatalogItem, CatalogItem, ItemMetadata } from './types'

type BuildItemParamOptions = { noLogo?: boolean }

export function buildUrl({ year, name, season }: BaseCatalogItem, type: 'VIDEOS' | 'IMAGES', id: string) {
  return `/APPAREL/${year}/${season}/${name}/${type}/${id}`
}

export function buildItemParams(params: ItemMetadata, options?: BuildItemParamOptions): Omit<CatalogItem, 'season'> {
  return Object.assign(
    {},
    {
      itemColor: params.color,
      itemHeader: params.name,
      itemDescription: params.description,
      itemLogo: !options?.noLogo ? buildUrl(params as BaseCatalogItem, 'IMAGES', 'logo.png') : undefined,
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
            path: buildUrl(params, 'IMAGES', 'front-large.png'),
            large: STORE_IMAGE_SIZES.LARGE,
            small: STORE_IMAGE_SIZES.SMALL
          },
          videoMedia: { path: buildUrl(params, 'VIDEOS', 'front.mp4'), lowq: 'q-5' }
        },
        // BACK CONTENT
        {
          imageMedia: {
            path: buildUrl(params, 'IMAGES', 'back-large.png'),
            large: STORE_IMAGE_SIZES.LARGE,
            small: STORE_IMAGE_SIZES.SMALL
          },
          videoMedia: { path: buildUrl(params, 'VIDEOS', 'back.mp4'), lowq: 'q-5' }
        }
      ]
    }
  )
}
