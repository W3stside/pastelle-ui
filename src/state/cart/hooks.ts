import { AddToCartButtonParams } from 'components/AddToCartButton'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useAddNewCartLine, useRemoveCartLine, useUpdateCartLine } from 'shopify/graphql/hooks'
import {
  addCartLineAndUpdateStore,
  removeCartLineAndUpdateStore,
  RemoveLineParams,
  updateCartLineAndUpdateStore,
  UpdateLineParams
} from 'shopify/utils/cart'
import { useAppSelector } from 'state'
import { createCart, CreateCartParams, updateCartInfo, UpdateCartInfoParams } from './reducer'

export function useCreateCartDispatch() {
  const dispatch = useDispatch()
  return useCallback((params: CreateCartParams) => dispatch(createCart(params)), [dispatch])
}

export function useGetCartDispatch() {
  return useAppSelector(state => state.cart)
}

export function useGetCartIdDispatch() {
  return useGetCartDispatch()?.cartId
}

export function useUpdateCartInfoDispatch() {
  const dispatch = useDispatch()

  return useCallback((params: UpdateCartInfoParams) => dispatch(updateCartInfo(params)), [dispatch])
}

export function useRemoveCartLineAndUpdateReduxCallback() {
  const cartId = useGetCartIdDispatch()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const [removeCartLine, rest] = useRemoveCartLine()

  return {
    ...rest,
    removeCartLineCallback: useCallback(
      ({ lineIds }: Pick<RemoveLineParams, 'lineIds'>) =>
        removeCartLineAndUpdateStore({ cartId, lineIds, removeCartLine, updateCartInfo }),
      [removeCartLine, cartId, updateCartInfo]
    )
  }
}

export function useUpdateCartLineAndUpdateReduxCallback() {
  const cartId = useGetCartIdDispatch()
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
  const cartId = useGetCartIdDispatch()
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
