import { gql } from '@apollo/client'

import { FRAGMENT_PRODUCT, FRAGMENT_PRODUCT_IMAGE, FRAGMENT_PRODUCT_VIDEO } from '../fragments'

export const QUERY_GET_COLLECTION = gql`
  ${FRAGMENT_PRODUCT}
  ${FRAGMENT_PRODUCT_IMAGE}
  ${FRAGMENT_PRODUCT_VIDEO}
  query getCollection($collectionAmount: Int, $productAmt: Int, $imageAmt: Int, $videoAmt: Int, $reverse: Boolean) {
    collections(first: $collectionAmount, reverse: $reverse) {
      nodes {
        id
        title
        handle
        image {
          url
        }
        lockStatus: metafield(namespace: "custom", key: "lock_status") {
          value
        }
        products(first: $productAmt) {
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
    }
  }
`
