import { CollectionResponseFormatted } from '@/shopify/graphql/hooks/query'

export function collectionProductFromParamsSelector(
  params: { handle?: string | string[]; id?: string | string[] } | undefined = { handle: undefined, id: undefined },
  latestCollection: CollectionResponseFormatted,
) {
  const { handle, id } = params
  if (typeof handle !== 'string' && typeof id !== 'string') return null

  if (!handle && typeof id === 'string') {
    const prodById = latestCollection.collectionProductList.find((prod) => prod.id === id)
    return prodById ?? null
  } else if (typeof handle === 'string') {
    const productsMap = latestCollection?.collectionProductMap
    return productsMap?.[handle] ?? null
  } else {
    return null
  }
}
