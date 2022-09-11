import { AddToCartButtonParams } from 'components/AddToCartButton'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useAddNewCartLine } from 'shopify/graphql/hooks'
import { addCartLineAndUpdateStore } from 'shopify/utils/cart'
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

export function useAddToCartAndUpdateCallback(props: Omit<AddToCartButtonParams, 'label'>) {
  const { merchandiseId, quantity } = props
  const cartId = useGetCartIdDispatch()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const [addNewCartLine, rest] = useAddNewCartLine()

  return {
    ...rest,
    addToCartCallback: useCallback(
      e => addCartLineAndUpdateStore(e, { cartId, quantity, merchandiseId, addNewCartLine, updateCartInfo }),
      [addNewCartLine, cartId, quantity, merchandiseId, updateCartInfo]
    )
  }
}
