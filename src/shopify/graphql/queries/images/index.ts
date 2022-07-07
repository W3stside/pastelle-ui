import { gql } from '@apollo/client'

export const QUERY_IMAGES = gql`
  query Images($amount: Int) {
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
        media(first: 6) {
          nodes {
            ... on MediaImage {
              mediaContentType
              image {
                id
                url
                altText
                width
                height
              }
            }
            ... on Video {
              mediaContentType
              id
              previewImage {
                url
              }
              sources {
                mimeType
                url
              }
            }
            ... on ExternalVideo {
              mediaContentType
              id
              embedUrl
              host
            }
          }
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
