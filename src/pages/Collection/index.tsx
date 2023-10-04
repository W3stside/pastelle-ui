import { useIsMobile, useStateRef } from '@past3lle/hooks'
import { ArticleFadeInContainer } from 'components/Layout'
import SEO from 'components/SEO'
import { ScrollingContentPage } from 'components/ScrollingContentPage'
import { BASE_FONT_SIZE, LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import AsideWithVideo from 'pages/Collection/AsideWithVideo'
import { CollectionPageProps } from 'pages/common/types'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetCurrentCollectionFromUrl, useUpdateCurrentlyViewingCollection } from 'state/collection/hooks'
import { buildItemUrl } from 'utils/navigation'

export default function Collection() {
  const navigate = useNavigate()
  const [container, setContainerRef] = useStateRef<HTMLElement | null>(null, (node) => node)

  // get latest collection and the current on screen item handle
  const collection = useGetCurrentCollectionFromUrl()
  useUpdateCurrentlyViewingCollection(true, collection)

  const isMobileDeviceOrWidth = useIsMobile()
  const collectionProductList = Object.values(collection?.products || {})

  // on mobile sizes we set a fixed height
  const fixedItemHeight = useMemo(() => {
    const cHeight = container?.clientHeight || 0

    return (collectionProductList.length <= 3 || isMobileDeviceOrWidth) && cHeight
      ? // container height - the header and 70px to fit the next product label
        isMobileDeviceOrWidth
        ? cHeight - LAYOUT_REM_HEIGHT_MAP.HEADER * BASE_FONT_SIZE
        : cHeight
      : undefined
  }, [collectionProductList.length, container?.clientHeight, isMobileDeviceOrWidth])

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

  const mappedCollectionItems = useMemo(
    () =>
      collectionProductList.map((item) => {
        const newItem = Object.assign({}, item)
        if (item?.lockedImages?.[0]?.url) newItem.images = item.lockedImages
        return newItem
      }),
    [collectionProductList]
  )

  if (!collection) return null

  return (
    <>
      <SEO title="COLLECTION" name="COLLECTION" description="PASTELLE. HEAVY STREETWEAR. PORTUGAL." />
      <ArticleFadeInContainer id="COLLECTION-ARTICLE" ref={setContainerRef}>
        {collectionProductList.length > 1 ? (
          <ScrollingContentPage
            data={mappedCollectionItems}
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
