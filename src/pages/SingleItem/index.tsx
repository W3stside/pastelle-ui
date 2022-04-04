import { ArticleFadeInContainer } from 'components/Layout/Article'
import { useCatalogItemFromURL } from 'pages/Catalog/hooks'
import AsideWithVideo from './AsideWithVideo'

export default function SingleItem() {
  // get catalog item from data and url
  const { currentItem } = useCatalogItemFromURL()

  return (
    <ArticleFadeInContainer id="CATALOG-ARTICLE">
      <AsideWithVideo {...currentItem} isActive itemIndex={0} showBreadCrumbs />
    </ArticleFadeInContainer>
  )
}
