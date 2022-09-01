import { gql } from '@apollo/client'
import { FRAGMENT_PRODUCT_IMAGE, FRAGMENT_PRODUCT_VIDEO } from '../fragments'

export const QUERY_PRODUCT = gql`
  ${FRAGMENT_PRODUCT_IMAGE}
  ${FRAGMENT_PRODUCT_VIDEO}
  query Product($amount: Int, $imageAmt: Int) {
    products(first: $amount) {
      nodes {
        id
        title
        description
        descriptionHtml
        sizes: options {
          values
        }
        updatedAt
        featuredImage {
          url
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
        bgColor: metafield(namespace: "custom", key: "bgColor") {
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
`
