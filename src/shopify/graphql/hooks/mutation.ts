import { useMutation } from '@apollo/client'
import { UPDATE_CART_LINE, CREATE_CART, ADD_NEW_CART_LINE } from 'shopify/graphql/mutations/cart'
import {
  AddNewCartLineMutation,
  AddNewCartLineMutationVariables,
  CreateCartMutation,
  CreateCartMutationVariables,
  UpdateCartLineMutation,
  UpdateCartLineMutationVariables
} from '../types'

const REFETCH_CART = {
  refetchQueries: [
    'getCart' // Query name
  ]
}

export function useCreateCart() {
  return useMutation<CreateCartMutation, CreateCartMutationVariables>(CREATE_CART)
}

export const useUpdateCartLine = () => {
  return useMutation<UpdateCartLineMutation, UpdateCartLineMutationVariables>(UPDATE_CART_LINE, REFETCH_CART)
}

export const useAddNewCartLine = () => {
  return useMutation<AddNewCartLineMutation, AddNewCartLineMutationVariables>(ADD_NEW_CART_LINE, REFETCH_CART)
}
