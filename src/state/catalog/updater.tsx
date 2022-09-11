import { useEffect } from 'react'
import { useQueryCurrentCatalog } from 'shopify/graphql/hooks'
import { useUpdateCatalog } from './hooks'

export default function Updater() {
  const updateCatalog = useUpdateCatalog()
  const { catalogProductMap } = useQueryCurrentCatalog({
    collectionAmount: 1,
    productAmt: 10,
    imageAmt: 10
  })

  useEffect(() => {
    if (catalogProductMap) {
      updateCatalog(catalogProductMap)
    }
  }, [catalogProductMap, updateCatalog])

  return null
}
