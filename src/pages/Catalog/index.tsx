import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { useCurrentCollectionProductsFromUrl } from './hooks'
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
  const { products, currentProduct } = useCurrentCollectionProductsFromUrl()
  const onScreenItemId = useOnScreenItemID()

  const fixedHeight = isMobile ? 550 : undefined

  const onContentClick = useCallback(() => {
    if (onScreenItemId) {
      push(buildItemUrl({ identifier: onScreenItemId }))
    }
  }, [onScreenItemId, push])

  const AsideWithVideoAux = useCallback(
    props => (
      <AsideWithVideo
        {...props}
        // catalog mode
        catalogView
        showBreadCrumbs={false}
        loadInView={{ container: document, conditionalCheck: true }}
      />
    ),
    []
  )

  return (
    <ArticleFadeInContainer id="CATALOG-ARTICLE">
      {products.length > 1 ? (
        <ScrollingContentPage
          data={products}
          dataItem={currentProduct}
          IterableComponent={AsideWithVideoAux}
          baseContentMessage="SCROLL/DRAG FOR MORE SHIT!"
          width={`calc(100% - ${STORE_IMAGE_SIZES.SMALL}px)`}
          bgColor="#ffffffdb"
          onlyOne="BOTTOM"
          showIndicator={false}
          fixedHeight={fixedHeight}
          onContentClick={onContentClick}
        />
      ) : (
        <AsideWithVideoAux {...currentProduct} onClick={onContentClick} />
      )}
    </ArticleFadeInContainer>
  )
}
