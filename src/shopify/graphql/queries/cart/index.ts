import { gql } from '@apollo/client'
import { FRAGMENT_CART } from '../fragments'

export const GET_CART = gql`
  ${FRAGMENT_CART}
  query getCart($cartId: ID!, $linesAmount: Int!) {
    cart(id: $cartId) {
      ...FragmentCart
    }
  }
`
