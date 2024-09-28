import { CurrencyCode } from '@/shopify/graphql/types'
import { MakeRequired } from '@past3lle/types'

interface BaseSchema {
  '@context': 'https://schema.org'
  name: string
  image: string
  description: string
  url: string
  brand: {
    '@type': 'Brand'
    name: 'PASTELLE APPAREL'
  }
}

interface ProductOffersSchema {
  '@type': 'Offer'
  url?: string
  priceCurrency: CurrencyCode
  price: string
  availability: 'https://schema.org/InStock'
}

export interface ProductSchema extends BaseSchema {
  '@type': 'Product'
  offers: ProductOffersSchema
  material: string
  color?: string
  size: string[]
  additionalType?: string
}

export interface CollectionSchema extends BaseSchema {
  '@type': 'Collection'
  mainEntity: ProductSchema & { offers: MakeRequired<ProductSchema['offers'], 'url'> }
}
