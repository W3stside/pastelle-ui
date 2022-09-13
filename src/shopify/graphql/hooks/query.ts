import { useQuery } from '@apollo/client'
import { mapShopifyProductToProps } from 'shopify/utils'
import { QUERY_GET_COLLECTION } from 'shopify/graphql/queries/collections'
import {
  GetCollectionQueryVariables,
  GetCollectionQuery,
  ProductVariantQuery,
  ProductVariantQueryVariables,
  GetCartQueryVariables,
  GetCartQuery
} from 'shopify/graphql/types'
import { useParseCatalogDetailsFromURL } from 'state/catalog/hooks'
import { ProductPageProps, CatalogMap } from 'pages/SingleItem/AsideWithVideo'
import { useOnScreenProductHandle } from 'state/catalog/hooks'
import { QUERY_PRODUCT_VARIANT_BY_KEY_VALUE } from '../queries/products'
import { GET_CART } from '../queries/cart'

export const DEFAULT_CURRENT_COLLECTION_VARIABLES = {
  collectionAmount: 1,
  productAmt: 10,
  imageAmt: 20
}

export function useQueryCollections(variables: GetCollectionQueryVariables) {
  return useQuery<GetCollectionQuery, GetCollectionQueryVariables>(QUERY_GET_COLLECTION, {
    variables
  })
}

export function useQueryCurrentCatalog(variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES) {
  const { data, error } = useQueryCollections(variables)

  if (error) {
    console.error('Error fetching current catalog using variables:' + variables, 'Error:', error)
  }

  // collection
  const collection = data?.collections?.nodes[0]
  // products from collection mapped = catalog
  const catalogProductList = mapShopifyProductToProps(collection?.products.nodes)
  // { [PRODUCT_HANDLE]: PRODUCT }
  const catalogProductMap = catalogProductList.reduce((acc, product: ProductPageProps) => {
    acc[product.handle] = product

    return acc
  }, {} as CatalogMap)

  return { catalogProductMap, catalogProductList }
}

export function useQueryCurrentCatalogProductsFromUrl(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  // we need to use the URL to determine what item we're currently viewing
  const [pathname, [productName]] = useParseCatalogDetailsFromURL()

  const { catalogProductMap, catalogProductList } = useQueryCurrentCatalog(variables)

  const urlItem = catalogProductMap[productName]
  const currentCatalogProduct = urlItem || catalogProductList[0]

  return {
    catalogProductList,
    currentCatalogProduct,
    pathname
  }
}

export function useQueryCurrentOnScreenCatalogProduct(
  variables: GetCollectionQueryVariables = DEFAULT_CURRENT_COLLECTION_VARIABLES
) {
  const { catalogProductMap } = useQueryCurrentCatalog(variables)
  const item = useOnScreenProductHandle()

  return item ? catalogProductMap[item.handle] : undefined
}

export function useQueryProductVariantByKeyValue(variables: ProductVariantQueryVariables) {
  const { data, error } = useQuery<ProductVariantQuery, ProductVariantQueryVariables>(
    QUERY_PRODUCT_VARIANT_BY_KEY_VALUE,
    { variables }
  )
  if (error) {
    console.error(error)
  }

  // return first
  return data?.product
}

export function useQueryCart(variables: GetCartQueryVariables) {
  const { data, loading, error } = useQuery<GetCartQuery, GetCartQueryVariables>(GET_CART, { variables })

  if (error) {
    console.error(error)
  }

  return { data, loading, error }
}

type ProductVariantIdParams = ProductVariantQueryVariables
export function useQueryProductVariantId(params: ProductVariantIdParams) {
  return useQueryProductVariantByKeyValue(params)?.variantBySelectedOptions?.id
}
