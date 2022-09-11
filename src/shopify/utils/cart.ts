import { FetchResult } from '@apollo/client'
import { ChangeEvent } from 'react'
import { AddNewCartLineMutation, CartMutationCartLinesAdd } from 'shopify/graphql/types'
import { UpdateCartInfoParams } from 'state/cart/reducer'

type Params = {
  cartId: string | undefined
  quantity: number
  merchandiseId: string | undefined
  addNewCartLine: (...params: any[]) => Promise<any>
  updateCartInfo: (
    params: UpdateCartInfoParams
  ) => {
    payload: UpdateCartInfoParams
    type: string
  }
}
export const addCartLineAndUpdateStore = async (
  e: ChangeEvent<HTMLButtonElement>,
  { cartId, quantity, merchandiseId, addNewCartLine, updateCartInfo }: Params
) => {
  e.preventDefault()
  if (!cartId || !merchandiseId) return

  const response = await addNewCartLine({
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }]
    }
  })

  const id = _getCartProp(response)?.id
  const totalQuantity = _getCartProp(response)?.totalQuantity
  const costs = _getCartProp(response)?.cost

  if (!id) {
    console.error('[AddNewCartLine] Error! No cartId returned. Check method.')
  }
  updateCartInfo({ totalQuantity, costs, cartId: id })
}

function _getCartProp(response: FetchResult<AddNewCartLineMutation, Record<string, any>, Record<string, any>>) {
  const cartLinesAdd: CartMutationCartLinesAdd = response.data?.cartLinesAdd

  return cartLinesAdd?.cart
}
