import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { FragmentCartCostFragment } from '@/shopify/graphql/types'

export type CartState = {
  cartId: string | undefined
  totalQuantity: number
  costs?: FragmentCartCostFragment
  readonly showCart: boolean
}

const initialState: CartState = {
  cartId: undefined,
  totalQuantity: 0,
  costs: undefined,
  showCart: false,
}

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
    },
    setShowCart(state, action: PayloadAction<boolean>) {
      state.showCart = action.payload
    },
  },
})

export const { createCart, updateCartInfo, setShowCart } = cartSlice.actions
export const cart = cartSlice.reducer
