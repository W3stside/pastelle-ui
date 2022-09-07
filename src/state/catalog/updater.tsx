import { useEffect } from 'react'
import { useCurrentCollectionProducts } from 'pages/Catalog/hooks'
import { useUpdateCatalog } from './hooks'

export default function Updater() {
  const updateCatalog = useUpdateCatalog()
  const { productsMap } = useCurrentCollectionProducts({
    collectionAmount: 1,
    productAmt: 10,
    imageAmt: 10
  })

  useEffect(() => {
    if (productsMap) {
      updateCatalog(productsMap)
    }
  }, [productsMap, updateCatalog])

  return null
}
