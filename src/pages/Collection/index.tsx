import { useIsMobile, useStateRef } from '@past3lle/hooks'
import { ArticleFadeInContainer } from '@/components/Layout/Article'
import SEO from '@/components/SEO'
import { ScrollingContentPage } from '@/components/ScrollingContentPage'
import { BASE_FONT_SIZE, LAYOUT_REM_HEIGHT_MAP } from '@/constants/sizes'
// import AsideWithVideo from '@/components/Asides/collection/AsideWithVideo'
import { DEFAULT_MEDIA_START_INDEX } from '@/components/pages-common/constants'
import { useProductWebCarouselActions } from '@/components/pages-common/hooks/useProductCarouselActions'
import { AsideWithVideoAuxProps, CollectionPageProps } from '@/components/pages-common/types'
import { useCallback, useMemo } from 'react'
import { buildItemUrl } from '@/utils/navigation'
import { useRouter } from 'next/router'
import { CollectionResponseFormatted } from '@/shopify/graphql/hooks'
import { formattedCollectionQuery } from '@/shopify/graphql/api/collection'
import { PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from '@/constants/config'
import { ProductCollectionSortKeys } from '@/shopify/graphql/types'
import { wrapper } from '@/state'
import { updateCollections, updateCurrentCollection } from '@/state/collection/reducer'
import { ShopifyIdType, shortenShopifyId } from '@/shopify/utils'
import { DEFAULT_COLLECTION_DESCRIPTION } from '@/components/SEO/constants'
import { getCollectionSeoSchema } from '@/components/SEO/utils'
import { CollectionSchema } from '@/components/SEO/types'
import dynamic from 'next/dynamic'

const CollectionAsideWithVideo = dynamic(
  import(
    /* webpackPrefetch: true,  webpackChunkName: "COLLECTIONASIDEWITHVIDEO" */ '@/components/Asides/collection/AsideWithVideo'
  ),
)

// const IS_SERVER = typeof globalThis?.window == 'undefined'
// const ANCHOR_NODE = IS_SERVER ? null : document

// eslint-disable-next-line react-refresh/only-export-components
export const getStaticProps = wrapper.getStaticProps((store) => async (): Promise<{ props: Props }> => {
  const collections = await formattedCollectionQuery({
    collectionAmount: 1,
    // always show the latest collection
    productAmt: 10,
    imageAmt: PRODUCT_IMAGES_AMOUNT,
    videoAmt: PRODUCT_VIDEOS_AMOUNT,
    // reverse array to get first as latest
    reverse: true,
    productSortKey: ProductCollectionSortKeys.BestSelling,
  })

  if (collections.length) {
    const formattedCollections = collections.map(({ collectionProductMap, locked, id, title }) => ({
      products: collectionProductMap,
      locked,
      id: shortenShopifyId(id as ShopifyIdType, 'Collection'),
      title,
    }))

    store.dispatch(
      updateCollections({
        collections: formattedCollections,
        loading: false,
      }),
    )

    if (formattedCollections?.[0]?.id) {
      store.dispatch(
        updateCurrentCollection({
          id: formattedCollections[0].id,
          locked: formattedCollections[0]?.locked,
          loading: false,
        }),
      )
    }
  }

  return {
    props: {
      collection: collections?.[0] ?? null,
      schemaSEO: getCollectionSeoSchema(collections?.[0]),
    },
  }
})

interface Props {
  collection: CollectionResponseFormatted | null
  schemaSEO: CollectionSchema | null
}
export default function Collection({ collection, schemaSEO }: Props) {
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
  const fixedItemHeight = useMemo(() => {
    const cHeight = container?.clientHeight || 0

    return ((!!collectionProductList && collectionProductList?.length <= 3) || isMobileDeviceOrWidth) && cHeight
      ? // container height - the header and 70px to fit the next product label
        isMobileDeviceOrWidth
        ? cHeight - LAYOUT_REM_HEIGHT_MAP.HEADER * BASE_FONT_SIZE
        : cHeight
      : undefined
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collection],
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

  if (!collection || !schemaSEO || !mappedCollectionItems || collectionProductList?.length < 1) return null

  return (
    <>
      <SEO
        name="Collection | PASTELLE APPAREL"
        title={collection.seo.title || 'Latest Collection | PASTELLE APPAREL'}
        description={collection.seo.description || DEFAULT_COLLECTION_DESCRIPTION}
        image={collection.image || ''}
        cannonicalUrl="collection"
        schema={schemaSEO}
      />
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
    </>
  )
}
