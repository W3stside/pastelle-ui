import { MediaWidths } from '@past3lle/theme'
import { DDPXImageUrlMap } from '@past3lle/types'
import { useMemo } from 'react'
import { ShopImageSrcSet } from '@/types'

const BASE_IK_URI = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

export function useShopifySrcSetToImageKitSrcSet(srcSet: ShopImageSrcSet | undefined, transformations: string) {
  const { defaultUrl: oDefaultUrl, ...restImages } = srcSet || {}
  const mappedSrcSet = useMemo(
    () =>
      !oDefaultUrl
        ? undefined
        : {
            ...Object.entries(restImages as Omit<ShopImageSrcSet, 'defaultUrl'>).reduce(
              (acc, [size, imgMap]: [string, DDPXImageUrlMap]) => {
                acc[size as unknown as MediaWidths] = {
                  '1x': imgMap?.['1x']?.replace('https://cdn.shopify.com/', `${BASE_IK_URI}/tr:${transformations}/`),
                  '2x': imgMap?.['2x']?.replace('https://cdn.shopify.com/', `${BASE_IK_URI}/tr:${transformations}/`),
                  '3x': imgMap?.['3x']?.replace('https://cdn.shopify.com/', `${BASE_IK_URI}/tr:${transformations}/`),
                }
                return acc
              },
              {} as ShopImageSrcSet,
            ),
            defaultUrl: oDefaultUrl.replace('https://cdn.shopify.com/', `${BASE_IK_URI}/tr:${transformations}/`),
          },
    [oDefaultUrl, restImages, transformations],
  )

  return mappedSrcSet
}
