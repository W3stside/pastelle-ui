import { MutationHookOptions } from '@apollo/client'
import { AddToCartButtonParams } from 'components/AddToCartButton'
import { useCallback } from 'react'
import { useAddNewCartLine, useRemoveCartLine, useUpdateCartLine } from 'shopify/graphql/hooks'
import {
  RemoveLineParams,
  UpdateLineParams,
  addCartLineAndUpdateStore,
  removeCartLineAndUpdateStore,
  updateCartLineAndUpdateStore
} from 'shopify/utils/cart'
import { useAppDispatch, useAppSelector } from 'state'

import { CreateCartParams, UpdateCartInfoParams, createCart, setShowCart, updateCartInfo } from './reducer'

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
      [removeCartLine, cartId, updateCartInfo]
    )
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
      [updateCartLine, cartId, updateCartInfo]
    )
  }
}

export function useAddLineToCartAndUpdateReduxCallback() {
  const cartId = useGetCartIdState()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const [addNewCartLine, rest] = useAddNewCartLine()

  return {
    ...rest,
    addLineToCartCallback: useCallback(
      ({ merchandiseId, quantity }: Omit<AddToCartButtonParams, 'label'>) =>
        addCartLineAndUpdateStore({ cartId, quantity, merchandiseId, addNewCartLine, updateCartInfo }),
      [addNewCartLine, cartId, updateCartInfo]
    )
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

export function useToggleCartAndState(): [boolean, (state: boolean) => void] {
  const cartOpen = useAppSelector((state) => state.cart.showCart)
  const dispatch = useOpenOrCloseCart()
  return [cartOpen, dispatch]
}
