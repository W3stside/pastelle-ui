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
    productType
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
    showcaseVideos: metafield(namespace: "custom", key: "videos") {
      value
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
    shortDescription: metafield(namespace: "custom", key: "short_description") {
      value
    }
  }
`

export const FRAGMENT_PRODUCT_IMAGE_URLS = gql`
  fragment FragmentProductImageUrls on Image {
    url125: url(transform: { maxWidth: 125, preferredContentType: WEBP })
    url250: url(transform: { maxWidth: 250, preferredContentType: WEBP })
    url500: url(transform: { maxWidth: 500, preferredContentType: WEBP })
    url720: url(transform: { maxWidth: 720, preferredContentType: WEBP })
    url960: url(transform: { maxWidth: 960, preferredContentType: WEBP })
    url1280: url(transform: { maxWidth: 1280, preferredContentType: WEBP })
    url1440: url(transform: { maxWidth: 1440, preferredContentType: WEBP })

    url125_2x: url(transform: { maxWidth: 125, preferredContentType: WEBP, scale: 2 })
    url250_2x: url(transform: { maxWidth: 250, preferredContentType: WEBP, scale: 2 })
    url500_2x: url(transform: { maxWidth: 500, preferredContentType: WEBP, scale: 2 })
    url720_2x: url(transform: { maxWidth: 720, preferredContentType: WEBP, scale: 2 })
    url960_2x: url(transform: { maxWidth: 960, preferredContentType: WEBP, scale: 2 })
    url1280_2x: url(transform: { maxWidth: 1280, preferredContentType: WEBP, scale: 2 })
    url1440_2x: url(transform: { maxWidth: 1440, preferredContentType: WEBP, scale: 2 })

    url125_3x: url(transform: { maxWidth: 125, preferredContentType: WEBP, scale: 3 })
    url250_3x: url(transform: { maxWidth: 250, preferredContentType: WEBP, scale: 3 })
    url500_3x: url(transform: { maxWidth: 500, preferredContentType: WEBP, scale: 3 })
    url720_3x: url(transform: { maxWidth: 720, preferredContentType: WEBP, scale: 3 })
    url960_3x: url(transform: { maxWidth: 960, preferredContentType: WEBP, scale: 3 })
    url1280_3x: url(transform: { maxWidth: 1280, preferredContentType: WEBP, scale: 3 })
    url1440_3x: url(transform: { maxWidth: 1440, preferredContentType: WEBP, scale: 3 })
  }
`

export const FRAGMENT_PRODUCT_IMAGE = gql`
  ${FRAGMENT_PRODUCT_IMAGE_URLS}
  fragment FragmentProductImage on Image {
    id
    altText
    width
    height
    url

    ...FragmentProductImageUrls
  }
`

export const FRAGMENT_PRODUCT_VIDEO = gql`
  fragment FragmentProductVideo on Video {
    id
    alt
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

export const FRAGMENT_CART_LINE = gql`
  ${FRAGMENT_PRODUCT}
  ${FRAGMENT_PRODUCT_IMAGE}
  fragment FragmentCartLine on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        size: title
        product {
          ...FragmentProduct
          images(first: 5) {
            nodes {
              ...FragmentProductImage
            }
          }
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
`

export const FRAGMENT_CART_SIMPLE = gql`
  ${FRAGMENT_CART_COST}
  fragment FragmentCartSimple on Cart {
    id
    createdAt
    updatedAt
    totalQuantity
    checkoutUrl
    cost {
      ...FragmentCartCost
    }
  }
`

export const FRAGMENT_CART = gql`
  ${FRAGMENT_CART_SIMPLE}
  ${FRAGMENT_CART_LINE}
  fragment FragmentCart on Cart {
    ...FragmentCartSimple

    lines(first: $linesAmount) {
      nodes {
        ...FragmentCartLine
      }
    }
  }
`
