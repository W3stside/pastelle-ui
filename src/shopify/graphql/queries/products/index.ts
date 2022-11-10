import { gql } from '@apollo/client'
import { FRAGMENT_PRODUCT_IMAGE, FRAGMENT_PRODUCT, FRAGMENT_PRODUCT_VIDEO } from '../fragments'

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
  query ProductVariant($productId: ID!, $key: String!, $value: String!) {
    product(id: $productId) {
      variantBySelectedOptions(selectedOptions: { name: $key, value: $value }) {
        id
        title
      }
    }
  }
`
