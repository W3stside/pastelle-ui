import { ArticleFadeInContainer } from 'components/Layout/Article'
import { useNavigate, useParams } from 'react-router-dom'
import { useCurrentCatalog } from 'state/catalog/hooks'
import AsideWithVideo from './AsideWithVideo'

export default function SingleItem() {
  const navigate = useNavigate()
  const { handle } = useParams()

  const currentCatalog = useCurrentCatalog()

  const product = handle ? currentCatalog?.[handle] : null
  // redirect if no product
  if (!product) {
    navigate('/404')
    return null
  }

  return (
    <ArticleFadeInContainer id="CATALOG-ARTICLE">
      <AsideWithVideo {...product} firstPaintOver isActive itemIndex={0} showBreadCrumbs />
    </ArticleFadeInContainer>
  )
}
