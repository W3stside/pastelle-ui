import { FetchResult } from '@apollo/client'
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
export const addCartLineAndUpdateStore = async ({
  cartId,
  quantity,
  merchandiseId,
  addNewCartLine,
  updateCartInfo
}: Params) => {
  if (!cartId || !merchandiseId) return

  const response = await addNewCartLine({
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }]
    }
  })

  const totalQuantity = _getCartProp(response)?.totalQuantity
  const costs = _getCartProp(response)?.cost

  updateCartInfo({ totalQuantity, costs })
}

function _getCartProp(response: FetchResult<AddNewCartLineMutation, Record<string, any>, Record<string, any>>) {
  const cartLinesAdd: CartMutationCartLinesAdd = response.data?.cartLinesAdd

  return cartLinesAdd?.cart
}
