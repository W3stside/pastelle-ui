import { SkillLockStatus, SkillMetadata } from '@past3lle/forge-web3'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import {
  FragmentProductImageFragment,
  FragmentProductVideoFragment,
  Product,
  ProductArtistInfo,
  ProductOptionsSize,
} from 'shopify/graphql/types'
import { ShopImageSrcSet } from 'types'

export interface CommonSinglePageProps {
  bgColor: string
  logo?: ShopImageSrcSet
  altLogo?: ShopImageSrcSet
}

export interface BaseProductPageProps extends Omit<CommonSinglePageProps, 'altLogo'> {
  altColor: string
  color: string
  title: string
  handle: string
  productType: string
  headerLogo?: ShopImageSrcSet
  navLogo?: ShopImageSrcSet
  images: FragmentProductImageFragment[]
  lockedImages: FragmentProductImageFragment[]
  sizeChart: FragmentProductImageFragment[]
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
  lockStatus: SkillLockStatus
}

export type AsideWithVideoAuxProps = {
  lockStatus: SkillLockStatus
  isMobile: boolean
  carousel: {
    index: number
    onChange: (idx: number) => void
  }
}

export type CollectionMap = Record<Product['handle'], BaseProductPageProps>

export type ItemPageDesignsProps = {
  headerLogo?: string
  navLogo?: string
}

export type SingleProductPageProps = BaseProductPageProps & AsideWithVideoAuxProps
export type CollectionPageProps = BaseProductPageProps &
  AsideWithVideoAuxProps &
  ScrollableContentComponentBaseProps & { itemIndex: number }
export type WithParentAspectRatio = { parentAspectRatio?: number }
