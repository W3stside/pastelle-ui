import { GenericImageSrcSet } from 'components/Carousel'
import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import {
  FragmentProductImageFragment,
  FragmentProductVideoFragment,
  ProductArtistInfo,
  ProductBrandingAssets,
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
    const brandingAssetsMap = getMetafields<ProductBrandingAssets | undefined>(datum.brandingAssetMap)

    return {
      id: datum.id,
      title: datum.title,
      handle: datum.handle,
      // TODO: fix
      logo: brandingAssetsMap?.logo,
      headerLogo: brandingAssetsMap?.header,
      navLogo: brandingAssetsMap?.navBar,
      description: datum.descriptionHtml,
      // metafields
      bgColor: getMetafields<string>(datum.bgColor)?.toString(),
      color: getMetafields<string>(datum.color)?.toString(),
      artistInfo: getMetafields<ProductArtistInfo>(datum.artistInfo),
      // TODO: fix
      images: datum.images.nodes.slice(0, 2),
      // @ts-ignore - type
      videos: datum.media.nodes.filter(media => media?.__typename === 'Video') as FragmentProductVideoFragment[],
      sizes: getMetafields<ProductSizes[]>(datum.sizes[0].values)
    }
  })
}

export function getImageSizeMap(images: FragmentProductImageFragment[]) {
  return images.map<GenericImageSrcSet>(({ url, url500, url720, url960, url1280 }) => ({
    defaultUrl: url,
    '500': url500,
    '720': url720,
    '960': url960,
    '1280': url1280
  }))
}
