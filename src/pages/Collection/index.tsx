import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCurrentCollection } from 'state/collection/hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'
import AsideWithVideo, { SingleItemPageProps } from 'pages/SingleItem/AsideWithVideo'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { isMobile } from 'utils'
import { useOnScreenProductHandle } from 'state/collection/hooks'
import { buildItemUrl } from 'utils/navigation'

export default function Collection() {
  const navigate = useNavigate()
  // get latest collection and the current on screen item handle
  const { collection } = useCurrentCollection()
  const product = useOnScreenProductHandle()

  // on mobile sizes we set a fixed height
  const fixedHeight = isMobile ? 550 : undefined

  const onContentClick = useCallback(() => {
    if (product) {
      navigate(buildItemUrl(product.handle))
    }
  }, [product, navigate])

  const AsideWithVideoAux = useCallback(
    (
      props: { onClick?: () => void } & Omit<SingleItemPageProps, 'collectionView' | 'showBreadCrumbs' | 'loadInView'>
    ) => (
      <AsideWithVideo
        {...props}
        // collection mode
        collectionView
        showBreadCrumbs={false}
        loadInView={{ container: document, conditionalCheck: true }}
      />
    ),
    []
  )

  if (!collection) return null
  const collectionProductList = Object.values(collection)

  return (
    <ArticleFadeInContainer id="COLLECTION-ARTICLE">
      {collectionProductList.length > 1 ? (
        <ScrollingContentPage
          data={collectionProductList}
          dataItem={collectionProductList[0]}
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
        <AsideWithVideoAux
          {...collectionProductList[0]}
          itemIndex={0}
          isActive
          firstPaintOver
          onClick={onContentClick}
        />
      )}
    </ArticleFadeInContainer>
  )
}
