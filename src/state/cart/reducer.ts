import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { FragmentCartCostFragment } from '@/shopify/graphql/types'

export type CartState = {
  cartId: string | null
  totalQuantity: number
  costs: FragmentCartCostFragment | null
  readonly showCart: boolean
}

const initialState: CartState = {
  cartId: null,
  totalQuantity: 0,
  costs: null,
  showCart: false,
}

export type CreateCartParams = string
export type UpdateCartInfoParams = {
  cartId: string
  totalQuantity?: number
  costs?: CartState['costs']
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
      { payload: { cartId, totalQuantity = 0, costs = null } }: PayloadAction<UpdateCartInfoParams>,
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
