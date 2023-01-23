import { ShowcaseGender } from 'state/user/reducer'

import { AddNewCartLineMutation, GetCartQuery, ProductQuery } from './_generated_'

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
export type ProductShowcaseVideos =
  | {
      [gender in ShowcaseGender]: (string | null)[]
    }
  | null

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
export type ProductsList = ProductQuery['products']['nodes']
export type Product = ProductsList[0]
export type ProductOptionsSize = Product['sizes'][0]['values']
export type ProductImagesSrcSet = {
  url500: string
  url720: string
  url960: string
  url1280: string
  url: string
}
export type ProductImageSrcSetKeys = 'url' | 'url500' | 'url720' | 'url960' | 'url1280'
export type CartQueryCart = GetCartQuery['cart']
export type CartMutationCartLinesAdd = AddNewCartLineMutation['cartLinesAdd']
