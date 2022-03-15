import { AsideWithVideo } from 'pages/SingleItem'

import { useCatalogItemFromURL } from './hooks'

import { ScrollingContentPage } from 'components/ScrollingContentPage'

export const BASE_CATALOG_URL = '/catalog/2022/FALL/'

export default function Catalog() {
  // get catalog item from data and url
  const { seasonList, currentItem } = useCatalogItemFromURL()

  return (
    <ScrollingContentPage
      data={seasonList}
      dataItem={currentItem}
      IterableComponent={AsideWithVideo}
      baseContentMessage="SCROLL/DRAG FOR MORE SHIT!"
      width="calc(100% - 500px)"
      bgColor="#ffffffdb"
      onlyOne="TOP"
    />
  )
}
