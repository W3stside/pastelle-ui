import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCurrentCollection } from 'state/collection/hooks'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'
import { ScrollingContentPage } from 'components/ScrollingContentPage'
import AsideWithVideo from 'pages/Collection/AsideWithVideo'
import { CollectionPageProps } from 'pages/common/types'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { buildItemUrl } from 'utils/navigation'
import useStateRef from 'hooks/useStateRef'
import { BASE_FONT_SIZE, LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import { isMobile } from 'utils'

export default function Collection() {
  const navigate = useNavigate()
  const [container, setContainerRef] = useStateRef<HTMLElement | null>(null, node => node)
  // get latest collection and the current on screen item handle
  const { collection } = useCurrentCollection()
  const isMobileWidth = useIsMobileWindowWidthSize()

  const cHeight = container?.clientHeight || 0
  // on mobile sizes we set a fixed height
  const fixedItemHeight = useMemo(
    () =>
      (isMobile || isMobileWidth) && cHeight
        ? // container height - the header and 70px to fit the next product label
          cHeight - LAYOUT_REM_HEIGHT_MAP.HEADER * BASE_FONT_SIZE
        : undefined,
    [cHeight, isMobileWidth]
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
