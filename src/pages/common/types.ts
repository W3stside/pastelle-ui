import { SkillMetadata } from '@past3lle/forge-web3'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import {
  FragmentProductImageFragment,
  FragmentProductVideoFragment,
  Product,
  ProductArtistInfo,
  ProductOptionsSize,
} from 'shopify/graphql/types'
import { ShopImageSrcSet } from 'types'

export interface BaseProductPageProps {
  altColor: string
  bgColor: string
  color: string
  title: string
  handle: string
  productType: string
  logo?: ShopImageSrcSet
  headerLogo?: ShopImageSrcSet
  navLogo?: ShopImageSrcSet
  images: FragmentProductImageFragment[]
  lockedImages: FragmentProductImageFragment[]
  videos: FragmentProductVideoFragment[]
  // media: (FragmentProductExternalVideoFragment | FragmentProductVideoFragment)[]
  sizes: ProductOptionsSize
  description: string
  artistInfo?: ProductArtistInfo
  shortDescription?: string
  id: string
  noVideo?: boolean
  noDescription?: boolean
  skillMetadata?: SkillMetadata
}

export type CollectionMap = Record<Product['handle'], BaseProductPageProps>

export type ItemPageDesignsProps = {
  headerLogo?: string
  navLogo?: string
}

export type SingleProductPageProps = BaseProductPageProps
export type CollectionPageProps = BaseProductPageProps & ScrollableContentComponentBaseProps & { itemIndex: number }
export type WithParentAspectRatio = { parentAspectRatio?: number }
