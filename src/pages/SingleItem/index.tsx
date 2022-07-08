import { ArticleFadeInContainer } from 'components/Layout/Article'
import { useCurrentCollectionProductsFromUrl } from 'pages/Catalog/hooks'
import AsideWithVideo from './AsideWithVideo'

export default function SingleItem() {
  // get catalog item from data and url
  const { currentProduct } = useCurrentCollectionProductsFromUrl()

  return (
    <ArticleFadeInContainer id="CATALOG-ARTICLE">
      <AsideWithVideo {...currentProduct} firstPaintOver isActive itemIndex={0} showBreadCrumbs />
    </ArticleFadeInContainer>
  )
}
