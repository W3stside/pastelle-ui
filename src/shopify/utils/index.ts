import { ProductPageProps } from 'pages/SingleItem/AsideWithVideo'
import {
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

export function getMetafields(query: any) {
  const test = query?.value || query
  if (isJson(test)) {
    return JSON.parse(test)
  } else {
    return test
  }
}

export const mapShopifyProductToProps = (data: ProductsList = []): ProductPageProps[] => {
  return data.map(datum => {
    const brandingAssetsMap = getMetafields(datum.brandingAssetMap) as ProductBrandingAssets | undefined

    return {
      id: datum.id,
      title: datum.title,
      // TODO: fix
      logo: brandingAssetsMap?.logo,
      headerLogo: brandingAssetsMap?.header,
      navLogo: brandingAssetsMap?.navBar,
      description: datum.descriptionHtml,
      // metafields
      bgColor: getMetafields(datum.bgColor)?.toString() as string,
      color: getMetafields(datum.color)?.toString() as string,
      artistInfo: getMetafields(datum.artistInfo) as ProductArtistInfo,
      // TODO: fix
      images: datum.images.nodes.slice(0, 2),
      // @ts-ignore - type
      videos: datum.media.nodes.filter(media => media?.__typename === 'Video') as FragmentProductVideoFragment[],
      sizes: getMetafields(datum.sizes[0].values) as ProductSizes[]
    }
  })
}
