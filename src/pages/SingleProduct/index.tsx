import { ArticleFadeInContainer } from 'components/Layout/Article'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCurrentCollection, useUpdateCurrentlyViewingProduct } from 'state/collection/hooks'
import AsideWithVideo from './AsideWithVideo'

export default function SingleItem() {
  const navigate = useNavigate()
  const { handle } = useParams()

  const { collection } = useCurrentCollection()

  const product = useMemo(() => (handle ? collection?.[handle] : null), [collection, handle])

  // update state store with current browsing SINGLE product
  useUpdateCurrentlyViewingProduct(true, product)

  // redirect if no product
  if (!product) {
    navigate('/404')
    return null
  }

  return (
    <ArticleFadeInContainer id="COLLECTION-ARTICLE">
      <AsideWithVideo {...product} />
    </ArticleFadeInContainer>
  )
}
