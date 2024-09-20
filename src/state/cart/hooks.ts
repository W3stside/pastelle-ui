import { MutationHookOptions } from '@apollo/client'
import { viewCartAnalytics } from '@/analytics/events/cartEvents'
import { SearchParamQuickViews } from '@/constants/views'
import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAddNewCartLine, useRemoveCartLine, useUpdateCartLine } from '@/shopify/graphql/hooks'
import {
  RemoveLineParams,
  UpdateLineParams,
  addCartLineAndUpdateStore,
  removeCartLineAndUpdateStore,
  updateCartLineAndUpdateStore,
} from '@/shopify/utils/cart'
import { useAppDispatch, useAppSelector } from '@/state'

import { CartState, CreateCartParams, UpdateCartInfoParams, createCart, setShowCart, updateCartInfo } from './reducer'

export function useCreateCartDispatch() {
  const dispatch = useAppDispatch()
  return useCallback((params: CreateCartParams) => dispatch(createCart(params)), [dispatch])
}

export function useGetCartState() {
  return useAppSelector((state) => state.cart)
}

export function useGetCartIdState() {
  return useGetCartState()?.cartId
}

export function useUpdateCartInfoDispatch() {
  const dispatch = useAppDispatch()

  return useCallback((params: UpdateCartInfoParams) => dispatch(updateCartInfo(params)), [dispatch])
}

export function useRemoveCartLineAndUpdateReduxCallback() {
  const cartId = useGetCartIdState()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const [removeCartLine, rest] = useRemoveCartLine()

  return {
    ...rest,
    removeCartLineCallback: useCallback(
      ({ lineIds }: Pick<RemoveLineParams, 'lineIds'>, options?: MutationHookOptions) =>
        removeCartLineAndUpdateStore({ cartId, lineIds, options, removeCartLine, updateCartInfo }),
      [removeCartLine, cartId, updateCartInfo],
    ),
  }
}

export function useUpdateCartLineAndUpdateReduxCallback() {
  const cartId = useGetCartIdState()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const [updateCartLine, rest] = useUpdateCartLine()

  return {
    ...rest,
    updateCartLineCallback: useCallback(
      ({ lineId, quantity }: Pick<UpdateLineParams, 'lineId' | 'quantity'>) =>
        updateCartLineAndUpdateStore({ cartId, quantity, lineId, updateCartLine, updateCartInfo }),
      [updateCartLine, cartId, updateCartInfo],
    ),
  }
}

type AddLineToCartProps = {
  merchandiseId: string | undefined
  quantity: number
}
export function useAddLineToCartAndUpdateReduxCallback() {
  const cartId = useGetCartIdState()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const [addNewCartLine, rest] = useAddNewCartLine()

  return {
    ...rest,
    addLineToCartCallback: useCallback(
      ({ merchandiseId, quantity }: AddLineToCartProps) =>
        addCartLineAndUpdateStore({ cartId, quantity, merchandiseId, addNewCartLine, updateCartInfo }),
      [addNewCartLine, cartId, updateCartInfo],
    ),
  }
}

export function useOpenOrCloseCart() {
  const dispatch = useAppDispatch()
  return useCallback((state: boolean) => dispatch(setShowCart(state)), [dispatch])
}

export function useCloseCart(): () => void {
  const setter = useOpenOrCloseCart()
  return useCallback(() => setter(false), [setter])
}

export function useToggleCart(): () => void {
  const cartOpen = useAppSelector((state) => state.cart.showCart)
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setShowCart(!cartOpen)), [dispatch, cartOpen])
}

export function useToggleCartAndState(): [boolean, (state: boolean, cart: CartState | null) => void] {
  const navigate = useNavigate()
  const cartOpen = useAppSelector((state) => state.cart.showCart)
  const dispatch = useOpenOrCloseCart()

  const [, setSearchParams] = useSearchParams()

  const viewCartCallback = useCallback(
    (showOpen: boolean, cart: CartState | null) => {
      !!showOpen && cart && viewCartAnalytics(cart)
      showOpen ? setSearchParams({ peek: SearchParamQuickViews.CART }) : navigate(-1)
      dispatch(showOpen)
    },
    [dispatch, navigate, setSearchParams],
  )
  return [cartOpen, viewCartCallback]
}
