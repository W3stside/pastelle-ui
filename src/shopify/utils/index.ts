import { GenericImageSrcSet } from 'utils/types'
import { BaseProductPageProps } from 'pages/common/types'
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

export function isProductVideo(data: any): data is FragmentProductVideoFragment {
  return '__typename' in data && data.__typename === 'Video'
}

export const mapShopifyProductToProps = (data: ProductsList = []): BaseProductPageProps[] => {
  return data.map(datum => {
    const productImages = datum.images.nodes.slice(0, 2)

    const metaAssets = datum.images.nodes.slice(2)
    const metaAssetMap = getImageSizeMap(metaAssets).reduce((acc, asset, i) => {
      const mappedAsset = metaAssets[i]
      if (mappedAsset?.altText) {
        acc[mappedAsset.altText.toLowerCase() as 'logo' | 'header' | 'navbar'] = asset
      }

      return acc
    }, {} as { logo: GenericImageSrcSet; navbar: GenericImageSrcSet; header: GenericImageSrcSet })

    return {
      id: datum.id,
      title: datum.title,
      handle: datum.handle,
      productType: datum.productType,
      // TODO: fix
      logo: metaAssetMap?.logo,
      headerLogo: metaAssetMap?.header,
      navLogo: metaAssetMap?.navbar,
      description: datum.descriptionHtml,
      // metafields
      bgColor: getMetafields<string>(datum.bgColor)?.toString(),
      color: getMetafields<string>(datum.color)?.toString(),
      artistInfo: getMetafields<ProductArtistInfo>(datum.artistInfo),
      // TODO: fix
      images: productImages,
      // @ts-ignore - type
      videos: datum.media.nodes.filter(isProductVideo) as FragmentProductVideoFragment[],
      sizes: getMetafields<ProductSizes[]>(datum.sizes[0].values),
      shortDescription: getMetafields<string>(datum.shortDescription)
    }
  })
}

export function getImageSizeMap(images: FragmentProductImageFragment[]) {
  return images.map<GenericImageSrcSet>(({ url, ...urls }) => ({
    defaultUrl: url,
    '500': { '1x': urls.url500, '2x': urls.url500_2x, '3x': urls.url500_3x },
    '720': { '1x': urls.url720, '2x': urls.url720_2x, '3x': urls.url720_3x },
    '960': { '1x': urls.url960, '2x': urls.url960_2x, '3x': urls.url960_3x },
    '1280': { '1x': urls.url1280, '2x': urls.url1280_2x, '3x': urls.url1280_3x },
    '1440': { '1x': urls.url1440, '2x': urls.url1440_2x, '3x': urls.url1440_3x }
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
