import { useStateRef } from '@past3lle/hooks'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCurrentCollection, useUpdateCurrentlyViewingProduct } from 'state/collection/hooks'

import AsideWithVideo from './AsideWithVideo'
import { SingleProductArticle } from './styled'

export default function SingleItem() {
  const [container, setContainerRef] = useStateRef<HTMLElement | null>(null, (node) => node)
  const parentAspectRatio = getNodeAspectRatio(container)

  const { handle } = useParams()
  const { collection } = useCurrentCollection()
  const product = useMemo(() => (handle ? collection?.[handle] : null), [collection, handle])

  // update state store with current browsing SINGLE product
  useUpdateCurrentlyViewingProduct(true, product)

  const navigate = useNavigate()
  // redirect if no product
  if (!product) {
    navigate('/404')
    return null
  }

  return (
    <SingleProductArticle id="COLLECTION-ARTICLE" display="flex" ref={setContainerRef}>
      <AsideWithVideo {...product} parentAspectRatio={parentAspectRatio} />
    </SingleProductArticle>
  )
}
function getNodeAspectRatio(node: HTMLElement | undefined | null) {
  if (!node) return undefined
  return node.clientWidth / node.clientHeight
}
