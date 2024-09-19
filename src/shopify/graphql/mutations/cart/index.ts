import { gql } from '@apollo/client'
import { FRAGMENT_CART_SIMPLE } from '@/shopify/graphql/queries/fragments'

export const CREATE_CART = gql`
  mutation CreateCart {
    cartCreate(input: { lines: [] }) {
      cart {
        id
        createdAt
        updatedAt
      }
    }
  }
`

export const REMOVE_CART_LINE = gql`
  ${FRAGMENT_CART_SIMPLE}
  mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...FragmentCartSimple
      }
    }
  }
`

export const UPDATE_CART_LINE = gql`
  ${FRAGMENT_CART_SIMPLE}
  mutation UpdateCartLine($cartId: ID!, $lineId: ID!, $quantity: Int!) {
    cartLinesUpdate(cartId: $cartId, lines: { id: $lineId, quantity: $quantity }) {
      cart {
        ...FragmentCartSimple
      }
    }
  }
`

export const ADD_NEW_CART_LINE = gql`
  ${FRAGMENT_CART_SIMPLE}
  mutation AddNewCartLine($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...FragmentCartSimple

        lines(first: 1) {
          nodes {
            merchandise {
              ... on ProductVariant {
                id
                priceV2 {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  handle
                }
              }
            }
          }
        }
      }
    }
  }
`
