import { gql } from '@apollo/client'

export const FRAGMENT_PRODUCT_VARIANT = gql`
  fragment FragmentProductVariant on ProductVariant {
    id
    title
    sku
    unitPrice {
      amount
      currencyCode
    }
    availableForSale
    quantityAvailable
  }
`

export const FRAGMENT_PRODUCT = gql`
  fragment FragmentProduct on Product {
    id
    title
    handle
    updatedAt
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
    options {
      name
      values
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
`

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

export const FRAGMENT_CART_COST = gql`
  fragment FragmentCartCost on CartCost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
    totalDutyAmount {
      amount
      currencyCode
    }
  }
`

export const FRAGMENT_CART = gql`
  ${FRAGMENT_CART_COST}
  fragment FragmentCart on Cart {
    id
    createdAt
    updatedAt
    totalQuantity
    lines(first: $linesAmount) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            size: title
            product {
              title
              handle
            }
            unitPrice {
              amount
              currencyCode
            }
          }
        }
        attributes {
          key
          value
        }
      }
    }
    attributes {
      key
      value
    }
    cost {
      ...FragmentCartCost
    }
    buyerIdentity {
      email
      phone
      customer {
        id
      }
      countryCode
    }
  }
`
