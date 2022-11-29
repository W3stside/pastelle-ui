import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCurrentCollection } from 'state/collection/hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'
import AsideWithVideo, { SingleItemPageProps } from 'pages/SingleItem/AsideWithVideo'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { isMobile } from 'utils'
import { buildItemUrl } from 'utils/navigation'

export default function Collection() {
  const navigate = useNavigate()
  // get latest collection and the current on screen item handle
  const { collection } = useCurrentCollection()

  // on mobile sizes we set a fixed height
  const fixedItemHeight = isMobile ? 550 : undefined

  const onContentClick = useCallback(
    (handle?: string) => {
      handle && navigate(buildItemUrl(handle))
    },
    [navigate]
  )

  const AsideWithVideoAux = useCallback(
    (
      props: { onClick?: () => void } & Omit<SingleItemPageProps, 'collectionView' | 'showBreadCrumbs' | 'loadInView'>
    ) => (
      <AsideWithVideo
        {...props}
        // collection mode
        collectionView
        showBreadCrumbs={false}
        loadInViewOptions={{ container: document, conditionalCheck: true }}
        showProductLabel
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
          fixedItemHeight={fixedItemHeight}
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
