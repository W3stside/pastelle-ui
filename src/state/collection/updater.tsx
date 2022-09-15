import { useEffect } from 'react'
import { useQueryCurrentCollection } from 'shopify/graphql/hooks'
import { useUpdateCollection } from './hooks'

export default function Updater() {
  const updateCollection = useUpdateCollection()
  const { title, collectionProductMap } = useQueryCurrentCollection({
    collectionAmount: 1,
    productAmt: 10,
    imageAmt: 10
  })

  useEffect(() => {
    if (collectionProductMap) {
      updateCollection(title, collectionProductMap)
    }
  }, [title, collectionProductMap, updateCollection])

  return null
}
