import { SkillMetadata } from '@past3lle/forge-web3'
import { BaseProductPageProps } from 'pages/common/types'
import {
  FragmentProductImageFragment,
  FragmentProductVideoFragment,
  Product,
  ProductArtistInfo,
  ProductSizes,
  ProductsList,
} from 'shopify/graphql/types'
import { ShopImageSrcSet } from 'types'

export function isJson(str: any) {
  if (typeof str === undefined || typeof str !== 'string') {
    return false
  }

  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export function getMetafields<T>(query: any) {
  const test = query?.value || query
  if (isJson(test)) {
    return JSON.parse(test) as T
  } else {
    return test as T
  }
}

export function isProductVideo(data: any): data is FragmentProductVideoFragment {
  return '__typename' in data && data.__typename === 'Video'
}

interface MetaAssetMap {
  logo: ShopImageSrcSet
  navbar: ShopImageSrcSet
  header: ShopImageSrcSet
}

export const mapSingleShopifyProductToProps = (
  product: Product,
  images: FragmentProductImageFragment[],
  lockedImages: FragmentProductImageFragment[],
  metaAssetMap: MetaAssetMap
) => ({
  id: product.id,
  title: product.title,
  handle: product.handle,
  productType: product.productType,
  // TODO: fix
  logo: metaAssetMap?.logo,
  headerLogo: metaAssetMap?.header,
  navLogo: metaAssetMap?.navbar,
  description: product.descriptionHtml,
  // metafields
  altColor: getMetafields<string>(product.altColor)?.toString(),
  bgColor: getMetafields<string>(product.bgColor)?.toString(),
  color: getMetafields<string>(product.color)?.toString(),
  artistInfo: getMetafields<ProductArtistInfo>(product.artistInfo),
  skillMetadata: getMetafields<SkillMetadata>(product.skillMetadata),
  // TODO: fix
  images,
  lockedImages,
  // @ts-ignore - type
  videos: product.media.nodes.filter(isProductVideo) as FragmentProductVideoFragment[],
  sizes: getMetafields<ProductSizes[]>(product.sizes[0].values),
  shortDescription: getMetafields<string>(product.shortDescription),
})

export const mapShopifyProductToProps = (data: ProductsList = []): BaseProductPageProps[] => {
  return data.map((datum) => {
    const productImages = datum.images.nodes.filter(
      (image) => image.altText === 'PRODUCT-FRONT' || image.altText === 'PRODUCT-BACK'
    )
    const lockedProductImages = datum.images.nodes.filter(
      (image) => image.altText === 'PRODUCT-FRONT-LOCKED' || image.altText === 'PRODUCT-BACK-LOCKED'
    )

    const metaAssets = datum.images.nodes.slice(2)
    const metaAssetMap: MetaAssetMap = getImageSizeMap(metaAssets).reduce((acc, asset, i) => {
      const mappedAsset = metaAssets[i]
      if (mappedAsset?.altText) {
        acc[mappedAsset.altText.toLowerCase() as 'logo' | 'header' | 'navbar'] = asset
      }

      return acc
    }, {} as { logo: ShopImageSrcSet; navbar: ShopImageSrcSet; header: ShopImageSrcSet })

    return mapSingleShopifyProductToProps(datum, productImages, lockedProductImages, metaAssetMap)
  })
}

export function getImageSizeMap(images: FragmentProductImageFragment[]) {
  return images.map<ShopImageSrcSet>(({ url, ...urls }) => ({
    defaultUrl: url,
    '500': { '1x': urls.url500, '2x': urls.url500_2x, '3x': urls.url500_3x },
    '720': { '1x': urls.url720, '2x': urls.url720_2x, '3x': urls.url720_3x },
    '960': { '1x': urls.url960, '2x': urls.url960_2x, '3x': urls.url960_3x },
    '1280': { '1x': urls.url1280, '2x': urls.url1280_2x, '3x': urls.url1280_3x },
    '1440': { '1x': urls.url1440, '2x': urls.url1440_2x, '3x': urls.url1440_3x },
  }))
}

export function sizeToFullSize(size: ProductSizes): string {
  switch (size) {
    case ProductSizes.S:
      return 'small'
    case ProductSizes.M:
      return 'medium'
    case ProductSizes.L:
      return 'large'
    case ProductSizes.XL:
      return 'x-large'
  }
}

export const sizeToFullSizeCapitalised = (size: ProductSizes): string => {
  const sizeSmall = sizeToFullSize(size)
  return sizeSmall.toUpperCase()
}

interface ReducedShowcaseVideos {
  [x: string]: FragmentProductVideoFragment
}

export function reduceShopifyMediaToShowcaseVideos(
  acc: Record<any, any>,
  media: FragmentProductVideoFragment
): ReducedShowcaseVideos {
  if (media?.id && media?.alt) {
    acc[media.alt] = media
  }

  return acc
}
export type ShopifyIdType = 'Product' | 'Collection' | 'Image' | 'Video'
export type ShopifyId<T extends ShopifyIdType> = `gid://shopify/${T}/${string | number}`
export function getShopifyId<T extends ShopifyIdType>(id: string | null, type: T): ShopifyId<T> | '' {
  const idIsAlreadyFormed = !!id?.match(`gid://shopify/${type}/`)
  const idAsNum = Number(id)

  if (idIsAlreadyFormed) {
    return id as ShopifyId<T>
  } else if (!!id && !!idAsNum) {
    return `gid://shopify/${type}/${idAsNum}`
  } else {
    return ''
  }
}
export function shortenShopifyId<T extends ShopifyIdType>(
  longId: T | string | number | undefined | null,
  type: T
): string | '' {
  const idIsAlreadyFormed = !!Number(longId)

  if (!!longId && idIsAlreadyFormed) {
    return longId.toString()
  } else if (typeof longId === 'string') {
    return longId.replace(`gid://shopify/${type}/`, '')
  } else {
    return ''
  }
}
