// import { lazy, Suspense } from 'react'
import { useCatalogItemFromURL } from './hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'

// const AsideWithVideo = lazy(() => import('pages/SingleItem'))
import AsideWithVideo from 'pages/SingleItem'

export const BASE_CATALOG_URL = '/catalog/2022/FALL/'

export default function Catalog() {
  // get catalog item from data and url
  const { seasonList, currentItem } = useCatalogItemFromURL()

  return (
    // <Suspense fallback={<p>Loading</p>}>
    <ScrollingContentPage
      data={seasonList}
      dataItem={currentItem}
      IterableComponent={AsideWithVideo}
      baseContentMessage="SCROLL/DRAG FOR MORE SHIT!"
      width="calc(100% - 500px)"
      bgColor="#ffffffdb"
      onlyOne="TOP"
    />
    // </Suspense>
  )
}
