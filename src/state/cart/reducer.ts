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
  totalQuantity?: number
  costs?: FragmentCartCostFragment
  cartId?: string
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
      { payload: { totalQuantity = 0, costs = undefined, cartId } }: PayloadAction<UpdateCartInfoParams>
    ) {
      state.totalQuantity = totalQuantity
      state.costs = costs
      state.cartId = cartId
    }
  }
})

export const { createCart, updateCartInfo } = cartSlice.actions
export const cart = cartSlice.reducer
