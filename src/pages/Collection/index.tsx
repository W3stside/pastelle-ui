import { useIsMobile, useStateRef } from '@past3lle/hooks'
import { ArticleFadeInContainer } from 'components/Layout'
import SEO from 'components/SEO'
import { ScrollingContentPage } from 'components/ScrollingContentPage'
import { BASE_FONT_SIZE, LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import AsideWithVideo from 'pages/Collection/AsideWithVideo'
import { CollectionPageProps } from 'pages/common/types'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentCollection } from 'state/collection/hooks'
import { buildItemUrl } from 'utils/navigation'

export default function Collection() {
  const navigate = useNavigate()
  const [container, setContainerRef] = useStateRef<HTMLElement | null>(null, (node) => node)
  // get latest collection and the current on screen item handle
  const { collection } = useCurrentCollection()
  const isMobileDeviceOrWidth = useIsMobile()

  const cHeight = container?.clientHeight || 0
  // on mobile sizes we set a fixed height
  const fixedItemHeight = useMemo(
    () =>
      isMobileDeviceOrWidth && cHeight
        ? // container height - the header and 70px to fit the next product label
          cHeight - LAYOUT_REM_HEIGHT_MAP.HEADER * BASE_FONT_SIZE
        : undefined,
    [cHeight, isMobileDeviceOrWidth]
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
    <>
      <SEO title="COLLECTION" name="COLLECTION" description="View the latest PASTELLE collection" />
      <ArticleFadeInContainer id="COLLECTION-ARTICLE" ref={setContainerRef}>
        {collectionProductList.length > 1 ? (
          <ScrollingContentPage
            data={collectionProductList.reverse()}
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
    </>
  )
}
