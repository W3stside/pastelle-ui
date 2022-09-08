import { ArticleFadeInContainer } from 'components/Layout/Article'
import { useGetCurrentCatalogProductsFromUrl } from 'state/catalog/hooks'
import AsideWithVideo from './AsideWithVideo'

export default function SingleItem() {
  // get catalog item from data and url
  const catalogInfoFromUrl = useGetCurrentCatalogProductsFromUrl()

  if (!catalogInfoFromUrl) return null

  return (
    <ArticleFadeInContainer id="CATALOG-ARTICLE">
      <AsideWithVideo
        {...catalogInfoFromUrl.currentCatalogProduct}
        firstPaintOver
        isActive
        itemIndex={0}
        showBreadCrumbs
      />
    </ArticleFadeInContainer>
  )
}
