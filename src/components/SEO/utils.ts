import { CollectionResponseFormatted } from '@/shopify/graphql/hooks'
import { DEFAULT_COLLECTION_DESCRIPTION, DEFAULT_PRODUCT_DESCRIPTION } from './constants'
import { BaseProductPageProps } from '../pages-common/types'

export function getCollectionSeoSchema(collection: CollectionResponseFormatted | null) {
  if (!collection) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Collection',
    name: collection.title.toUpperCase(),
    image: collection.image || '',
    url: `https://pastelle.shop/collection`,
    description: collection.seo?.description || DEFAULT_COLLECTION_DESCRIPTION,
    brand: {
      '@type': 'Brand',
      name: 'PASTELLE APPAREL',
    },
    mainEntity: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: collection.collectionProductList?.[0].handle,
      image: collection.collectionProductList?.[0].images?.[0].url,
      description: collection.collectionProductList?.[0].seo.description || DEFAULT_PRODUCT_DESCRIPTION,
      brand: {
        '@type': 'Brand',
        name: 'PASTELLE APPAREL',
      },
      url: `https://pastelle.shop/skill/${
        collection.collectionProductList?.[0].handle || collection.collectionProductList?.[0].id
      }`,
      offers: {
        '@type': 'Offer',
        url: `https://pastelle.shop/skill/${
          collection.collectionProductList?.[0].handle || collection.collectionProductList?.[0].id
        }`,
        priceCurrency: collection.collectionProductList?.[0].priceRange.minVariantPrice.currencyCode,
        price: collection.collectionProductList?.[0].priceRange.minVariantPrice?.amount?.toString() || 'unavailable',
        availability: 'https://schema.org/InStock',
      },
      material: 'Cotton',
      // color: 'Faded Black',
      additionalType: 'Oversized, Dropped Shoulder, Digital Prints, Organic, Heavy',
      size: collection.collectionProductList?.[0].sizes,
    },
  } as const
}

export function getProductSeoSchema(product: BaseProductPageProps | null) {
  if (!product) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.handle.toUpperCase(),
    image: product.images?.[0].url1280_2x,
    url: `https://pastelle.shop/skill/${product.handle}`,
    description: product.description || product.shortDescription || DEFAULT_PRODUCT_DESCRIPTION,
    brand: {
      '@type': 'Brand',
      name: 'PASTELLE APPAREL',
    },
    offers: {
      '@type': 'Offer',
      url: `https://pastelle.shop/skill/${product.handle}`,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      price: product.priceRange.minVariantPrice?.amount?.toString() || 'unavailable',
      availability: 'https://schema.org/InStock',
    },
    material: 'Cotton',
    // color: 'Faded Black',
    additionalType: 'Oversized, Dropped Shoulder, Digital Prints, Organic, Heavy',
    size: product.sizes,
  }
}
