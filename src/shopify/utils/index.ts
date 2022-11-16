import { GenericImageSrcSet } from 'components/Carousel'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import {
  FragmentProductImageFragment,
  FragmentProductVideoFragment,
  ProductArtistInfo,
  ProductSizes,
  ProductsList
} from 'shopify/graphql/types'

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

export const mapShopifyProductToProps = (data: ProductsList = []): ProductPageProps[] => {
  return data.map(datum => {
    const productImages = datum.images.nodes.slice(0, 2)

    const metaAssets = datum.images.nodes.slice(2)
    const metaAssetMap = getImageSizeMap(metaAssets).reduce((acc, asset, i) => {
      const mappedAsset = metaAssets[i]
      if (mappedAsset?.altText) {
        acc[mappedAsset.altText as 'LOGO' | 'HEADER' | 'NAVBAR'] = asset
      }

      return acc
    }, {} as { LOGO: GenericImageSrcSet; NAVBAR: GenericImageSrcSet; HEADER: GenericImageSrcSet })

    return {
      id: datum.id,
      title: datum.title,
      handle: datum.handle,
      // TODO: fix
      logo: metaAssetMap?.LOGO,
      headerLogo: metaAssetMap?.HEADER,
      navLogo: metaAssetMap?.NAVBAR,
      description: datum.descriptionHtml,
      // metafields
      bgColor: getMetafields<string>(datum.bgColor)?.toString(),
      color: getMetafields<string>(datum.color)?.toString(),
      artistInfo: getMetafields<ProductArtistInfo>(datum.artistInfo),
      // TODO: fix
      images: productImages,
      // @ts-ignore - type
      videos: datum.media.nodes.filter(media => media?.__typename === 'Video') as FragmentProductVideoFragment[],
      sizes: getMetafields<ProductSizes[]>(datum.sizes[0].values),
      shortDescription: getMetafields<string>(datum.shortDescription)
    }
  })
}

export function getImageSizeMap(images: FragmentProductImageFragment[]) {
  return images.map<GenericImageSrcSet>(({ url, url500, url720, url960, url1280, url1440 }) => ({
    defaultUrl: url,
    '500': url500,
    '720': url720,
    '960': url960,
    '1280': url1280,
    '1440': url1440
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
