import { useCollections } from 'pages/Catalog/hooks'

export default function Updater() {
  useCollections({
    collectionAmount: 1,
    productAmt: 5,
    imageAmt: 20
  })

  return null
}
