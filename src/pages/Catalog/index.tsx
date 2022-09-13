import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCurrentCatalog } from 'state/catalog/hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'
import AsideWithVideo, { SingleItemPageProps } from 'pages/SingleItem/AsideWithVideo'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { isMobile } from 'utils'
import { useOnScreenProductHandle } from 'state/catalog/hooks'
import { buildItemUrl } from 'utils/navigation'

export default function Catalog() {
  const navigate = useNavigate()
  // get latest catalog and the current on screen item handle
  const currentCatalog = useCurrentCatalog()
  const product = useOnScreenProductHandle()

  // on mobile sizes we set a fixed height
  const fixedHeight = isMobile ? 550 : undefined

  const onContentClick = useCallback(() => {
    if (product) {
      navigate(buildItemUrl({ identifier: product.handle }))
    }
  }, [product, navigate])

  const AsideWithVideoAux = useCallback(
    (props: { onClick?: () => void } & Omit<SingleItemPageProps, 'catalogView' | 'showBreadCrumbs' | 'loadInView'>) => (
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
        <AsideWithVideoAux {...catalogProductList[0]} itemIndex={0} isActive firstPaintOver onClick={onContentClick} />
      )}
    </ArticleFadeInContainer>
  )
}
