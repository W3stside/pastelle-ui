import { useIsMobile, useStateRef } from '@past3lle/hooks'
import { ArticleFadeInContainer } from '@/components/Layout/Article'
import SEO from '@/components/SEO'
import { ScrollingContentPage } from '@/components/ScrollingContentPage'
import { BASE_FONT_SIZE, LAYOUT_REM_HEIGHT_MAP } from '@/constants/sizes'
import { DEFAULT_MEDIA_START_INDEX } from '@/components/PagesComponents/constants'
import { useProductWebCarouselActions } from '@/components/PagesComponents/hooks/useProductCarouselActions'
import { AsideWithVideoAuxProps, CollectionPageProps } from '@/components/PagesComponents/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildItemUrl } from '@/utils/navigation'
import { useRouter } from 'next/router'
import { CollectionResponseFormatted } from '@/shopify/graphql/hooks'
import { wrapper } from '@/state'
import { DEFAULT_COLLECTION_DESCRIPTION } from '@/components/SEO/constants'
import { getCollectionSeoSchema } from '@/components/SEO/utils'
import { CollectionSchema } from '@/components/SEO/types'
import dynamic from 'next/dynamic'
import { useIsClientReady } from '@/hooks/useIsClientReady'
import { AnimatedPastelleLoader } from '@/components/Loader'
import { fetchLatestCollectionAndUpdateStore } from '@/api/collection'

const CollectionAsideWithVideo = dynamic(
  import(
    /* webpackPrefetch: true,  webpackChunkName: "COLLECTIONASIDEWITHVIDEO" */ '@/components/Asides/collection/AsideWithVideo'
  ),
)

// eslint-disable-next-line react-refresh/only-export-components
export const getStaticProps = wrapper.getStaticProps((store) => async (): Promise<{ props: Props }> => {
  // 1. Fetch store collection data from gql
  // 2. Save collection data to the redux store
  const [latestCollection] = await fetchLatestCollectionAndUpdateStore(store)

  return {
    props: {
      data: latestCollection ?? null,
      schema: getCollectionSeoSchema(latestCollection),
    },
  }
})

interface Props {
  data: CollectionResponseFormatted | null
  schema: CollectionSchema | null
}
export default function Collection({ data: collection, schema, ...rest }: Props) {
  // TODO: fix this. issue with hydration always being true
  // https://github.com/kirill-konshin/next-redux-wrapper/issues/571
  // We need this to sync client/server side data and the redux store
  wrapper.useHydration(rest)

  const { push: navigate } = useRouter()
  const [container, setContainerRef] = useStateRef<HTMLElement | null>(null, (node) => node)
  // MOBILE/WEB CAROUSEL
  const { currentIndex: currentCarouselIndex, onChange: onCarouselChange } = useProductWebCarouselActions({
    startIndex: DEFAULT_MEDIA_START_INDEX,
  })

  const isMobileDeviceOrWidth = useIsMobile()

  const collectionProductList = useMemo(
    () => collection?.collectionProductList || [],
    [collection?.collectionProductList],
  )

  // on mobile sizes we set a fixed height
  const [fixedItemHeight, setFixedItemHeight] = useState<number>(500)
  useEffect(() => {
    const cHeight = container?.clientHeight || 0

    setFixedItemHeight(
      ((!!collectionProductList && collectionProductList?.length <= 3) || isMobileDeviceOrWidth) && cHeight
        ? // container height - the header and 70px to fit the next product label
          isMobileDeviceOrWidth
          ? cHeight - LAYOUT_REM_HEIGHT_MAP.HEADER * BASE_FONT_SIZE
          : cHeight
        : 0,
    )
  }, [collectionProductList, container?.clientHeight, isMobileDeviceOrWidth])

  const onContentClick = useCallback(
    (handle?: string) => {
      if (handle) navigate(buildItemUrl(handle))
    },
    [navigate],
  )

  const AsideWithVideoAux = useCallback(
    (props: { onClick?: () => void } & Omit<CollectionPageProps, 'loadInView' | keyof AsideWithVideoAuxProps>) => (
      <CollectionAsideWithVideo
        {...props}
        firstPaintOver
        loadInViewOptions={undefined /* { container: ANCHOR_NODE, conditionalCheck: true } */}
        carousel={{ index: currentCarouselIndex, onChange: onCarouselChange }}
        lockStatus={collectionProductList?.[0]?.lockStatus}
        isMobile={isMobileDeviceOrWidth}
      />
    ),
    // Can safely ignore this as the IDs are unique
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collection?.id],
  )

  const mappedCollectionItems = useMemo(
    () =>
      collectionProductList?.map((item) => {
        const newItem = Object.assign({}, item)
        if (item?.lockedImages?.[0]?.url) newItem.images = item.lockedImages
        return newItem
      }),
    [collectionProductList],
  )

  const clientReady = useIsClientReady()

  const showLoader = !collection || !mappedCollectionItems || collectionProductList?.length < 1
  if (showLoader) return <AnimatedPastelleLoader />

  return (
    <>
      <SEO
        name="Collection | PASTELLE APPAREL"
        title={collection.seo.title || 'Latest Collection | PASTELLE APPAREL'}
        description={collection.seo.description || DEFAULT_COLLECTION_DESCRIPTION}
        image={collection.image || ''}
        cannonicalUrl="collection"
        schema={schema}
      />
      {clientReady && (
        <ArticleFadeInContainer id="COLLECTION-ARTICLE" ref={setContainerRef}>
          {mappedCollectionItems && collectionProductList.length > 1 ? (
            <ScrollingContentPage
              data={mappedCollectionItems}
              dataItem={collectionProductList?.[0]}
              IterableComponent={AsideWithVideoAux}
              fixedItemHeight={fixedItemHeight}
              onContentClick={onContentClick}
              touchAction="none"
            />
          ) : (
            <AsideWithVideoAux
              {...collectionProductList?.[0]}
              isActive
              itemIndex={0}
              firstPaintOver
              onClick={onContentClick}
            />
          )}
        </ArticleFadeInContainer>
      )}
    </>
  )
}
