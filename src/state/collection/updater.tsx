import { PRODUCT_AMOUNT, PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from 'constants/config'
import { useEffect } from 'react'
import { useQueryCurrentCollection } from 'shopify/graphql/hooks'

import { useUpdateCollection } from './hooks'

export default function Updater() {
  const updateCollection = useUpdateCollection()
  const { title, collectionProductMap } = useQueryCurrentCollection({
    collectionAmount: 1,
    productAmt: PRODUCT_AMOUNT,
    imageAmt: PRODUCT_IMAGES_AMOUNT,
    videoAmt: PRODUCT_VIDEOS_AMOUNT,
  })

  useEffect(() => {
    if (collectionProductMap) {
      updateCollection(title, collectionProductMap)
    }
  }, [title, collectionProductMap, updateCollection])

  return null
}
