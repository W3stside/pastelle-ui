import { useCatalogItemFromURL } from './hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'

import AsideWithVideo from 'pages/SingleItem/AsideWithVideo'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { isMobile } from 'utils'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useOnScreenItemID } from 'state/user/hooks'

export const BASE_CATALOG_URL = '/catalog/2022/FALL/'

export default function Catalog() {
  const { push } = useHistory()
  // get catalog item from data and url
  const { seasonList, currentItem } = useCatalogItemFromURL()
  const onScreenItemId = useOnScreenItemID()

  const fHeight = isMobile ? 550 : undefined

  const onContentClick = useCallback(() => {
    if (onScreenItemId) {
      push(onScreenItemId)
    }
  }, [onScreenItemId, push])

  const AsideWithVideoAux = useCallback(props => <AsideWithVideo {...props} showBreadCrumbs={false} />, [])

  return (
    <ArticleFadeInContainer id="CATALOG-ARTICLE">
      <ScrollingContentPage
        data={seasonList}
        dataItem={currentItem}
        IterableComponent={AsideWithVideoAux}
        baseContentMessage="SCROLL/DRAG FOR MORE SHIT!"
        width={`calc(100% - ${STORE_IMAGE_SIZES.SMALL}px)`}
        bgColor="#ffffffdb"
        onlyOne="BOTTOM"
        showIndicator={!isMobile}
        fHeight={fHeight}
        onContentClick={onContentClick}
      />
    </ArticleFadeInContainer>
  )
}
