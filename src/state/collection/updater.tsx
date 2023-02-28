import { devDebug } from '@past3lle/utils'
import { PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from 'constants/config'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_CURRENT_COLLECTION_VARIABLES,
  useQueryCurrentCollection,
  useQueryProductByIdAndMap,
} from 'shopify/graphql/hooks'
import { getShopifyId } from 'shopify/utils'

import { useUpdateCollection, useUpdateSingleProductInCollection } from './hooks'

export default function Updater() {
  const updateCollection = useUpdateCollection()
  const updateSingleItemInCollection = useUpdateSingleProductInCollection()

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
  const collection = useQueryCurrentCollection({
    // always show the latest collection
    collectionAmount: 1,
    productAmt: Number(flowParams.params.amount) || 0,
    imageAmt: PRODUCT_IMAGES_AMOUNT,
    videoAmt: PRODUCT_VIDEOS_AMOUNT,
  })

  useEffect(() => {
    if (singleSkill?.product) {
      devDebug('SINGLE SKILL FLOW', flowParams)
      const { title, product, loading } = singleSkill
      updateSingleItemInCollection(title, product, loading)
    } else if (!!collection?.collectionProductList.length) {
      devDebug('COLLECTION FLOW', flowParams)
      const { title, collectionProductMap, loading } = collection
      updateCollection(title, collectionProductMap, loading)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, singleSkill, updateCollection, updateSingleItemInCollection])

  // loading state used across the app Suspense
  // useEffect(() => {
  //   updateCollectionLoadingStatus(loading)
  // }, [loading, updateCollectionLoadingStatus])

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
    return { type: URLFlowType.SKILL, params: { id: shopifyId } }
  } else {
    // normal flow, e.g collection view
    return {
      type: URLFlowType.COLLECTION,
      params: { amount: searchParams.get('skills') || DEFAULT_CURRENT_COLLECTION_VARIABLES.productAmt },
    }
  }
}
