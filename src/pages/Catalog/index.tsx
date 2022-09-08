import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { useCurrentCatalog } from 'state/catalog/hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'
import AsideWithVideo from 'pages/SingleItem/AsideWithVideo'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { isMobile } from 'utils'
import { useOnScreenProductHandle } from 'state/user/hooks'
import { buildItemUrl } from 'utils/navigation'

export default function Catalog() {
  const { push } = useHistory()
  // get latest catalog and the current on screen item handle
  const currentCatalog = useCurrentCatalog()
  const product = useOnScreenProductHandle()

  // on mobile sizes we set a fixed height
  const fixedHeight = isMobile ? 550 : undefined

  const onContentClick = useCallback(() => {
    if (product) {
      push(buildItemUrl({ identifier: product.handle }))
    }
  }, [product, push])

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

  if (!currentCatalog) return null
  const catalogProductList = Object.values(currentCatalog)

  return (
    <ArticleFadeInContainer id="CATALOG-ARTICLE">
      {catalogProductList.length > 1 ? (
        <ScrollingContentPage
          data={catalogProductList}
          dataItem={catalogProductList[0]}
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
        <AsideWithVideoAux {...catalogProductList[0]} onClick={onContentClick} />
      )}
    </ArticleFadeInContainer>
  )
}
