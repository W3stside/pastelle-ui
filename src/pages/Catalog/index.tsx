// import { lazy, Suspense } from 'react'
import { useCatalogItemFromURL } from './hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'

// const AsideWithVideo = lazy(() => import('pages/SingleItem'))
import AsideWithVideo from 'pages/SingleItem'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { STORE_IMAGE_SIZES } from 'constants/config'

export const BASE_CATALOG_URL = '/catalog/2022/FALL/'

export default function Catalog() {
  // get catalog item from data and url
  const { seasonList, currentItem } = useCatalogItemFromURL()

  return (
    <ArticleFadeInContainer id="CATALOG-ARTICLE">
      <ScrollingContentPage
        data={seasonList}
        dataItem={currentItem}
        IterableComponent={AsideWithVideo}
        baseContentMessage="SCROLL/DRAG FOR MORE SHIT!"
        width={`calc(100% - ${STORE_IMAGE_SIZES.SMALL}px)`}
        bgColor="#ffffffdb"
        onlyOne="TOP"
      />
    </ArticleFadeInContainer>
  )
}
