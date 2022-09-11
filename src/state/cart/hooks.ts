import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
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
