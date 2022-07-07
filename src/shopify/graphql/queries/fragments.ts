import { gql } from '@apollo/client'

export const FRAGMENT_PRODUCT_IMAGE = gql`
  fragment FragmentProductImage on Image {
    id
    url
    altText
    width
    height
  }
`

export const FRAGMENT_PRODUCT_VIDEO = gql`
  fragment FragmentProductVideo on Video {
    id
    mediaContentType
    previewImage {
      url
      width
      height
    }
    sources {
      mimeType
      url
    }
  }
`

export const FRAGMENT_PRODUCT_EXTERNAL_VIDEO = gql`
  fragment FragmentProductExternalVideo on ExternalVideo {
    mediaContentType
    id
    embedUrl
    host
  }
`

/* export const FRAGMENT_PRODUCT = gql`
  ${FRAGMENT_PRODUCT_IMAGE}
  ${FRAGMENT_PRODUCT_VIDEO}
  ${FRAGMENT_PRODUCT_EXTERNAL_VIDEO}
  fragment FragmentProduct on Product($imageAmt: Int) {
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
        ...FragmentProductExternalVideo
      }
    }

    videos: metafield(namespace: "custom", key: "videos") {
      value
    }
    color: metafield(namespace: "custom", key: "color") {
      value
    }
    artistInfo: metafield(namespace: "custom", key: "artistInfo") {
      value
    }
  }
` */
