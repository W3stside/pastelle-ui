import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { useCatalogItemFromURL } from './hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'
import AsideWithVideo from 'pages/SingleItem/AsideWithVideo'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { isMobile } from 'utils'
import { useOnScreenItemID } from 'state/user/hooks'
import { buildItemUrl } from 'utils/navigation'

export default function Catalog() {
  const { push } = useHistory()
  // get catalog item from data and url
  const { seasonList, currentItem } = useCatalogItemFromURL()
  const onScreenItemId = useOnScreenItemID()

  const fixedHeight = isMobile ? 550 : undefined

  const onContentClick = useCallback(() => {
    if (onScreenItemId) {
      push(buildItemUrl({ identifier: onScreenItemId }))
    }
  }, [onScreenItemId, push])

  const AsideWithVideoAux = useCallback(props => <AsideWithVideo {...props} mobileView showBreadCrumbs={false} />, [])

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
        showIndicator={false}
        fixedHeight={fixedHeight}
        onContentClick={onContentClick}
      />
    </ArticleFadeInContainer>
  )
}
