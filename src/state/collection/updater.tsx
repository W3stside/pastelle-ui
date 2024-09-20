import { PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from '@/constants/config'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_CURRENT_COLLECTION_VARIABLES,
  useQueryCollections,
  useQueryProductByIdAndMap,
} from '@/shopify/graphql/hooks'
import { ProductCollectionSortKeys } from '@/shopify/graphql/types'
import { ShopifyIdType, getShopifyId, shortenShopifyId } from '@/shopify/utils'

import { useUpdateCollections, useUpdateCurrentlyViewing, useUpdateSingleProductInCollection } from './hooks'

export default function Updater() {
  const updateCollections = useUpdateCollections()
  const updateSingleItemInCollection = useUpdateSingleProductInCollection()
  const updateCurrentlyViewing = useUpdateCurrentlyViewing()

  const [searchParams] = useSearchParams()
  const flowParams = useMemo(() => getFlowParams(searchParams), [searchParams])

  // SINGLE SKILL, REFERRAL FLOW
  // undefined id variable skips query
  const singleSkill = useQueryProductByIdAndMap({
    id: flowParams.params.id || '',
    imageAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.imageAmt,
    videoAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.videoAmt,
  })

  // COLLECTION FLOW (standard)
  // undefined variable skips flow, e.g if above runs
  // Load the last 2 collections, index 0 being the latest
  const collections = useQueryCollections({
    collectionAmount: 1,
    // always show the latest collection
    productAmt: Number(flowParams.params.amount),
    imageAmt: PRODUCT_IMAGES_AMOUNT,
    videoAmt: PRODUCT_VIDEOS_AMOUNT,
    // reverse array to get first as latest
    reverse: true,
    productSortKey: ProductCollectionSortKeys.BestSelling,
  })

  useEffect(() => {
    if (!!collections.length) {
      updateCollections(
        collections.map(({ collectionProductMap, locked, id, title }) => ({
          products: collectionProductMap,
          locked,
          id: shortenShopifyId(id as ShopifyIdType, 'Collection'),
          title,
        })),
        false,
      )

      if (singleSkill?.id) {
        const { handle = 'UNKNOWN', id, product } = singleSkill
        updateCurrentlyViewing({ ...product, id, handle })
      }
    }
  }, [collections, flowParams, singleSkill, updateCollections, updateCurrentlyViewing, updateSingleItemInCollection])

  return null
}

export const enum URLFlowType {
  SKILL = 'SKILL',
  COLLECTION = 'COLLECTION',
}

const enum PastelleReferrals {
  FORGE = 'FORGE',
  OTHER = 'EXTERNAL',
}

export function getFlowParams(searchParams: URLSearchParams) {
  const shopifyId = getShopifyId(searchParams.get('id'), 'Product')
  if (shopifyId && searchParams.get('referral') === PastelleReferrals.FORGE) {
    return {
      type: URLFlowType.SKILL,
      params: { id: shopifyId, amount: DEFAULT_CURRENT_COLLECTION_VARIABLES.productAmt },
    }
  } else {
    // normal flow, e.g collection view
    return {
      type: URLFlowType.COLLECTION,
      params: { amount: searchParams.get('skills') || DEFAULT_CURRENT_COLLECTION_VARIABLES.productAmt },
    }
  }
}
