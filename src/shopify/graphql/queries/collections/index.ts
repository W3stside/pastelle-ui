import { gql } from '@apollo/client'
import { FRAGMENT_PRODUCT_IMAGE, FRAGMENT_PRODUCT_VIDEO, FRAGMENT_PRODUCT } from '../fragments'

export const QUERY_GET_COLLECTION = gql`
  ${FRAGMENT_PRODUCT}
  ${FRAGMENT_PRODUCT_IMAGE}
  ${FRAGMENT_PRODUCT_VIDEO}
  query getCollection($collectionAmount: Int, $productAmt: Int, $imageAmt: Int) {
    collections(first: $collectionAmount) {
      nodes {
        id
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
            media(first: $imageAmt, reverse: true) {
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
