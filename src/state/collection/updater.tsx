import { useEffect } from 'react'
import { useQueryCurrentCollection } from 'shopify/graphql/hooks'
import { useUpdateCollection } from './hooks'

export default function Updater() {
  const updateCollection = useUpdateCollection()
  const { collectionProductMap } = useQueryCurrentCollection({
    collectionAmount: 1,
    productAmt: 10,
    imageAmt: 10
  })

  useEffect(() => {
    if (collectionProductMap) {
      updateCollection(collectionProductMap)
    }
  }, [collectionProductMap, updateCollection])

  return null
}
