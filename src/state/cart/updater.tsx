import { useApolloClient } from '@apollo/client'
import { DEFAULT_CART_LINES_AMOUNT } from 'constants/config'
import { useEffect } from 'react'
import { useCreateCart } from 'shopify/graphql/hooks'
import { GET_CART } from 'shopify/graphql/queries/cart'
import { GetCartQuery, GetCartQueryVariables } from 'shopify/graphql/types'
import { useUpdateCartInfoDispatch, useGetCartIdDispatch } from 'state/cart/hooks'
import { UpdateCartInfoParams } from './reducer'

interface CartCreationCbs {
  createCart: ReturnType<typeof useCreateCart>[0]
  updateCartInfo: (params: UpdateCartInfoParams) => void
}

export default function CartUpdater() {
  const [createCart] = useCreateCart()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const { query } = useApolloClient()

  const cartId = useGetCartIdDispatch()

  useEffect(() => {
    if (cartId) {
      _queryAndUpdateCart({ cartId, query, updateCartInfo })
    } else {
      _createAndSaveCart({ createCart, updateCartInfo })
    }
  }, [cartId, createCart, query, updateCartInfo])

  return null
}

interface QueryCartParams {
  cartId: string
  query: ReturnType<typeof useApolloClient>['query']
  updateCartInfo: (params: UpdateCartInfoParams) => void
}

function _queryAndUpdateCart({ cartId, query, updateCartInfo }: QueryCartParams) {
  return query<GetCartQuery, GetCartQueryVariables>({
    query: GET_CART,
    variables: { cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT }
  })
    .then(({ data, error }) => {
      if (error) throw error

      if (data?.cart) {
        console.debug('[CART UPDATER::PREVIOUS CART SUB-UPDATER] --> Previous cart found! Setting.')
        updateCartInfo({
          cartId: data.cart.id,
          totalQuantity: data.cart.totalQuantity,
          costs: data.cart.cost
        })
      }
    })
    .catch(error => {
      console.error('CART UPDATER::PREVIOUS CART UPDATE ERROR!', error)
    })
}

async function _createAndSaveCart({ updateCartInfo, createCart }: CartCreationCbs) {
  return createCart()
    .then(({ data: cartResponse }) => {
      const cart = cartResponse?.cartCreate?.cart

      cart && updateCartInfo({ cartId: cart.id })
    })
    .catch(error => {
      console.error('[CART UPDATERS] Cart initialisation error!', error)
    })
}
