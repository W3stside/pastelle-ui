import { gql } from '@apollo/client'
import { FRAGMENT_CART_COST } from 'shopify/graphql/queries/fragments'

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

export const UPDATE_CART_LINE = gql`
  ${FRAGMENT_CART_COST}
  mutation UpdateCartLine($cartId: ID!, $lineId: ID!, $quantity: Int!) {
    cartLinesUpdate(cartId: $cartId, lines: { id: $lineId, quantity: $quantity }) {
      cart {
        id
        createdAt
        updatedAt
        totalQuantity
        cost {
          ...FragmentCartCost
        }
      }
    }
  }
`

export const ADD_NEW_CART_LINE = gql`
  ${FRAGMENT_CART_COST}
  mutation AddNewCartLine($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        createdAt
        updatedAt
        totalQuantity
        cost {
          ...FragmentCartCost
        }
        checkoutUrl
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
