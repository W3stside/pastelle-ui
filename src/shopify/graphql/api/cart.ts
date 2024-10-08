import { GET_CART } from '../queries/cart'
import { CreateCartMutation, GetCartQuery, GetCartQueryVariables } from '../types'
import { apolloClient } from '../ApolloClient'
import { CREATE_CART } from '../mutations/cart'

export async function queryCart(variables: GetCartQueryVariables) {
  const response = await apolloClient.query<GetCartQuery, GetCartQueryVariables>({
    query: GET_CART,
    variables,
  })

  if (!response.data || response.error) throw new Error('Failed getting cart data!')

  return response.data.cart
}

export async function createCart() {
  const response = await apolloClient.mutate<CreateCartMutation>({ mutation: CREATE_CART })

  if (!response.data || response.errors?.length) throw new Error('Failed creating cart!')

  return response.data.cartCreate
}
