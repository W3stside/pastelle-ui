import { gql } from '@apollo/client'
import { FRAGMENT_PRODUCT_IMAGE, FRAGMENT_PRODUCT_VARIANT, FRAGMENT_PRODUCT_VIDEO } from '../fragments'

export const QUERY_PRODUCT = gql`
  ${FRAGMENT_PRODUCT_VARIANT}
  ${FRAGMENT_PRODUCT_IMAGE}
  ${FRAGMENT_PRODUCT_VIDEO}
  query Product($amount: Int, $imageAmt: Int) {
    products(first: $amount) {
      nodes {
        ...FRAGMENT_PRODUCT_VARIANT

        images(first: $imageAmt) {
          nodes {
            ...FragmentProductImage
          }
        }
        media(first: $imageAmt, reverse: true) {
          nodes {
            ...FragmentProductVideo
          }
        }
      }
    }
  }
`
