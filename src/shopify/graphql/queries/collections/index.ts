import { gql } from '@apollo/client'
import { FRAGMENT_PRODUCT_IMAGE, FRAGMENT_PRODUCT_VIDEO } from '../fragments'

export const QUERY_GET_COLLECTION = gql`
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
            id
            updatedAt
            title
            description
            descriptionHtml
            sizes: options {
              values
            }
            featuredImage {
              url
              width
              height
            }
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
            brandingAssetMap: metafield(namespace: "custom", key: "brandingassetmap") {
              value
            }
            color: metafield(namespace: "custom", key: "color") {
              value
            }
            artistInfo: metafield(namespace: "custom", key: "artistInfo") {
              value
            }
          }
        }
      }
    }
  }
`
