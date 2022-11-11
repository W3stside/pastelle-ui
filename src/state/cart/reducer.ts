import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FragmentCartCostFragment } from 'shopify/graphql/types'

export type CartState = {
  cartId: string | undefined
  totalQuantity: number
  costs?: FragmentCartCostFragment
}

const initialState: CartState = {
  cartId: undefined,
  totalQuantity: 0,
  costs: undefined
} as CartState

export type CreateCartParams = string
export type UpdateCartInfoParams = {
  cartId: string
  totalQuantity?: number
  costs?: FragmentCartCostFragment
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    createCart(state, { payload }: PayloadAction<CreateCartParams>) {
      state.cartId = payload
    },
    updateCartInfo(
      state,
      { payload: { cartId, totalQuantity = 0, costs = undefined } }: PayloadAction<UpdateCartInfoParams>
    ) {
      state.cartId = cartId
      state.totalQuantity = totalQuantity
      state.costs = costs
    }
  }
})

export const { createCart, updateCartInfo } = cartSlice.actions
export const cart = cartSlice.reducer
