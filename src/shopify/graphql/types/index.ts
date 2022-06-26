import { GetCollectionQuery } from './_generated_'

export * from './_generated_'

export enum ProductSizes {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL'
}

export type ProductVideosBySize = {
  FRONT: string
  BACK: string
}

export type ProductVideos = {
  [size in ProductSizes]: ProductVideosBySize
}

export type ProductArtistInfo = {
  name: string
  type: string
  url: string
  display: string
}
export type ProductBrandingAssets = {
  logo: string
  navBar: string
  header: string
}
export type ProductsList = GetCollectionQuery['collections']['nodes'][0]['products']['nodes']
export type Product = ProductsList[0]
