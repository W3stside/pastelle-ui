import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCurrentCollection } from 'state/collection/hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'
import AsideWithVideo from 'pages/Collection/AsideWithVideo'
import { CollectionPageProps } from 'pages/common/types'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { buildItemUrl } from 'utils/navigation'
import useStateRef from 'hooks/useStateRef'
import { BASE_FONT_SIZE, HEADER_HEIGHT_REM } from 'constants/sizes'
import { isMobile } from 'utils'

const PRODUCT_LABEL_HEIGHT_REM = 7
export default function Collection() {
  const navigate = useNavigate()
  const [container, setContainerRef] = useStateRef<HTMLElement | null>(null, node => node)
  // get latest collection and the current on screen item handle
  const { collection } = useCurrentCollection()

  // on mobile sizes we set a fixed height
  const fixedItemHeight = useMemo(
    () =>
      isMobile && container?.clientHeight
        ? // container height - the header and 70px to fit the next product label
          container.clientHeight - (HEADER_HEIGHT_REM + PRODUCT_LABEL_HEIGHT_REM) * BASE_FONT_SIZE
        : undefined,
    [container?.clientHeight]
  )

  const onContentClick = useCallback(
    (handle?: string) => {
      handle && navigate(buildItemUrl(handle))
    },
    [navigate]
  )

  const AsideWithVideoAux = useCallback(
    (props: { onClick?: () => void } & Omit<CollectionPageProps, 'loadInView'>) => (
      <AsideWithVideo {...props} firstPaintOver loadInViewOptions={{ container: document, conditionalCheck: true }} />
    ),
    []
  )

  if (!collection) return null
  const collectionProductList = Object.values(collection)

  return (
    <ArticleFadeInContainer id="COLLECTION-ARTICLE" ref={setContainerRef}>
      {collectionProductList.length > 1 ? (
        <ScrollingContentPage
          data={collectionProductList}
          dataItem={collectionProductList[0]}
          IterableComponent={AsideWithVideoAux}
          fixedItemHeight={fixedItemHeight}
          onContentClick={onContentClick}
          touchAction="none"
        />
      ) : (
        <AsideWithVideoAux
          {...collectionProductList[0]}
          isActive
          itemIndex={0}
          firstPaintOver
          onClick={onContentClick}
        />
      )}
    </ArticleFadeInContainer>
  )
}
