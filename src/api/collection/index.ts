import { PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from '@/constants/config'
import { formattedCollectionQuery } from '@/shopify/graphql/api/collection'
import { ProductCollectionSortKeys } from '@/shopify/graphql/types'
import { shortenShopifyId, ShopifyIdType } from '@/shopify/utils'
import { AppStore } from '@/state'
import { updateCollections, updateCurrentCollection } from '@/state/collection/reducer'

export async function fetchLatestCollectionAndUpdateStore(store: AppStore) {
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

  if (collections.length > 0) {
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

  return collections
}
