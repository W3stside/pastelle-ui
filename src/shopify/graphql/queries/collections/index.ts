import { gql } from '@apollo/client'

import { FRAGMENT_PRODUCT, FRAGMENT_PRODUCT_IMAGE, FRAGMENT_PRODUCT_VIDEO } from '../fragments'

export const QUERY_GET_COLLECTION = gql`
  ${FRAGMENT_PRODUCT}
  ${FRAGMENT_PRODUCT_IMAGE}
  ${FRAGMENT_PRODUCT_VIDEO}
  query getCollection($collectionAmount: Int, $productAmt: Int, $imageAmt: Int, $videoAmt: Int) {
    collections(first: $collectionAmount) {
      nodes {
        id
        title
        handle
        image {
          url
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
