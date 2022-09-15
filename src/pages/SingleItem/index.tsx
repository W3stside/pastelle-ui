import { ArticleFadeInContainer } from 'components/Layout/Article'
import { useNavigate, useParams } from 'react-router-dom'
import { useCurrentCollection } from 'state/collection/hooks'
import AsideWithVideo from './AsideWithVideo'

export default function SingleItem() {
  const navigate = useNavigate()
  const { handle } = useParams()

  const { collection } = useCurrentCollection()

  const product = handle ? collection?.[handle] : null
  // redirect if no product
  if (!product) {
    navigate('/404')
    return null
  }

  return (
    <ArticleFadeInContainer id="COLLECTION-ARTICLE">
      <AsideWithVideo {...product} firstPaintOver isActive itemIndex={0} showBreadCrumbs />
    </ArticleFadeInContainer>
  )
}
