import { gql } from '@apollo/client'

export const FRAGMENT_PRODUCT_IMAGE = gql`
  fragment FragmentProductImage on Image {
    id
    url500: url(transform: { maxWidth: 500 })
    url720: url(transform: { maxWidth: 720 })
    url960: url(transform: { maxWidth: 960 })
    url1280: url(transform: { maxWidth: 1280 })
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
