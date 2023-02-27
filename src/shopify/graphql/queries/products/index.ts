import { gql } from '@apollo/client'

import { FRAGMENT_PRODUCT, FRAGMENT_PRODUCT_IMAGE, FRAGMENT_PRODUCT_VIDEO } from '../fragments'

export const QUERY_PRODUCT = gql`
  ${FRAGMENT_PRODUCT}
  ${FRAGMENT_PRODUCT_IMAGE}
  ${FRAGMENT_PRODUCT_VIDEO}
  query Product($amount: Int, $imageAmt: Int, $videoAmt: Int) {
    products(first: $amount) {
      nodes {
        ...FragmentProduct

        images(first: $imageAmt) {
          nodes {
            ...FragmentProductImage
          }
        }
        media(first: $videoAmt, reverse: true) {
          nodes {
            ...FragmentProductVideo
          }
        }
      }
    }
  }
`

export const QUERY_PRODUCT_VARIANT_BY_KEY_VALUE = gql`
  ${FRAGMENT_PRODUCT}
  query ProductVariant($productId: ID!, $key: String!, $value: String!) {
    product(id: $productId) {
      id
      variantBySelectedOptions(selectedOptions: { name: $key, value: $value }) {
        id
        title
        barcode
        sku
        selectedOptions {
          name
          value
        }
        product {
          ...FragmentProduct
          collections(first: 50) {
            nodes {
              id
              handle
              title
            }
          }
        }
        priceV2 {
          amount
          currencyCode
        }
        availableForSale
        quantityAvailable
      }
    }
  }
`

export const QUERY_PRODUCT_BY_ID = gql`
  ${FRAGMENT_PRODUCT}
  ${FRAGMENT_PRODUCT_IMAGE}
  ${FRAGMENT_PRODUCT_VIDEO}
  query ProductByID($id: ID!, $imageAmt: Int, $videoAmt: Int) {
    product(id: $id) {
      ...FragmentProduct

      images(first: $imageAmt) {
        nodes {
          ...FragmentProductImage
        }
      }
      media(first: $videoAmt, reverse: true) {
        nodes {
          ...FragmentProductVideo
        }
      }
    }
  }
`
