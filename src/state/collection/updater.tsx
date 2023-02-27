import { PRODUCT_AMOUNT, PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from 'constants/config'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryCurrentCollection } from 'shopify/graphql/hooks'

import { useUpdateCollection, useUpdateCollectionLoadingStatus } from './hooks'

export default function Updater() {
  const [searchParams] = useSearchParams()
  const skillsToShow = Number(searchParams.get('skills'))

  const updateCollectionLoadingStatus = useUpdateCollectionLoadingStatus()
  const updateCollection = useUpdateCollection()

  const { title, collectionProductMap, loading } = useQueryCurrentCollection({
    // always show the latest collection
    collectionAmount: 1,
    productAmt: !!skillsToShow ? skillsToShow : PRODUCT_AMOUNT,
    imageAmt: PRODUCT_IMAGES_AMOUNT,
    videoAmt: PRODUCT_VIDEOS_AMOUNT,
  })

  // loading state used across the app Suspense
  useEffect(() => {
    updateCollectionLoadingStatus(loading)
  }, [loading, updateCollectionLoadingStatus])

  useEffect(() => {
    if (collectionProductMap) {
      updateCollection(title, collectionProductMap, loading)
    }
  }, [title, collectionProductMap, loading, updateCollection])

  return null
}
