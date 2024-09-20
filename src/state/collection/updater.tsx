import { PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from '@/constants/config'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_CURRENT_COLLECTION_VARIABLES,
  useQueryCollections,
  useQueryProductByIdAndMap,
} from '@/shopify/graphql/hooks'
import { ProductCollectionSortKeys } from '@/shopify/graphql/types'
import { ShopifyIdType, shortenShopifyId } from '@/shopify/utils'

import { useUpdateCollections, useUpdateCurrentlyViewing, useUpdateSingleProductInCollection } from './hooks'
import { getFlowParams } from './utils'

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
    if (collections.length) {
      updateCollections(
        collections.map(({ collectionProductMap, locked, id, title }) => ({
          products: collectionProductMap,
          locked,
          id: shortenShopifyId(id as ShopifyIdType, 'Collection'),
          title,
        })),
        false
      )

      if (singleSkill?.id) {
        const { handle = 'UNKNOWN', id, product } = singleSkill
        updateCurrentlyViewing({ ...product, id, handle })
      }
    }
  }, [collections, flowParams, singleSkill, updateCollections, updateCurrentlyViewing, updateSingleItemInCollection])

  return null
}
