import { DocumentNode, OperationVariables, useMutation } from '@apollo/client'
import { DEFAULT_CART_LINES_AMOUNT } from 'constants/config'
import { UPDATE_CART_LINE, CREATE_CART, ADD_NEW_CART_LINE } from 'shopify/graphql/mutations/cart'
import { useGetCartIdDispatch } from 'state/cart/hooks'
import { GET_CART } from '../queries/cart'
import {
  AddNewCartLineMutation,
  AddNewCartLineMutationVariables,
  CreateCartMutation,
  CreateCartMutationVariables,
  UpdateCartLineMutation,
  UpdateCartLineMutationVariables
} from '../types'

export function useCreateCart() {
  return useMutation<CreateCartMutation, CreateCartMutationVariables>(CREATE_CART)
}

export const useUpdateCartLine = () => {
  const cartId = useGetCartIdDispatch()
  return useMutation<UpdateCartLineMutation, UpdateCartLineMutationVariables>(
    UPDATE_CART_LINE,
    _refetchQuery(GET_CART, { cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT })
  )
}

export const useAddNewCartLine = () => {
  const cartId = useGetCartIdDispatch()
  return useMutation<AddNewCartLineMutation, AddNewCartLineMutationVariables>(
    ADD_NEW_CART_LINE,
    _refetchQuery(GET_CART, { cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT })
  )
}

function _refetchQuery(query: DocumentNode, variables: OperationVariables) {
  return {
    refetchQueries: [{ query, variables }]
  }
}
