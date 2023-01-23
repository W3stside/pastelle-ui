import { DocumentNode, OperationVariables, useMutation } from '@apollo/client'
import { DEFAULT_CART_LINES_AMOUNT } from 'constants/config'
import { ADD_NEW_CART_LINE, CREATE_CART, REMOVE_CART_LINE, UPDATE_CART_LINE } from 'shopify/graphql/mutations/cart'
import { useGetCartIdState, useGetCartState } from 'state/cart/hooks'

import { GET_CART } from '../queries/cart'
import {
  AddNewCartLineMutation,
  AddNewCartLineMutationVariables,
  CreateCartMutation,
  CreateCartMutationVariables,
  RemoveCartLineMutation,
  RemoveCartLineMutationVariables,
  UpdateCartLineMutation,
  UpdateCartLineMutationVariables
} from '../types'

export function useCreateCart() {
  return useMutation<CreateCartMutation, CreateCartMutationVariables>(CREATE_CART)
}

export const useRemoveCartLine = () => {
  const cart = useGetCartState()
  return useMutation<RemoveCartLineMutation, RemoveCartLineMutationVariables>(REMOVE_CART_LINE, {
    refetchQueries: _refetchQuery(GET_CART, { cartId: cart.cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT })
  })
}

export const useUpdateCartLine = () => {
  const cart = useGetCartState()
  return useMutation<UpdateCartLineMutation, UpdateCartLineMutationVariables>(UPDATE_CART_LINE, {
    refetchQueries: _refetchQuery(GET_CART, { cartId: cart.cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT })
  })
}

export const useAddNewCartLine = () => {
  const cartId = useGetCartIdState()
  return useMutation<AddNewCartLineMutation, AddNewCartLineMutationVariables>(ADD_NEW_CART_LINE, {
    refetchQueries: _refetchQuery(GET_CART, { cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT })
  })
}

function _refetchQuery(query: DocumentNode, variables: OperationVariables) {
  return [{ query, variables }]
}

/* 
** OPTIMISTIC RESPONSE 
** E.G:
    optimisticResponse({ cartId: cartIdPassed }) {
      return {
        __typename: 'Mutation',
        cartLinesRemove: {
          __typename: 'CartLinesRemovePayload',
          cart: {
            __typename: 'Cart',
            id: cartIdPassed,
            get createdAt() {
              return new Date().toISOString()
            },
            get updatedAt() {
              return new Date().toISOString()
            },
            totalQuantity: cart!.totalQuantity - 1,
            checkoutUrl: 'void',
            cost: {
              __typename: 'CartCost',
              totalAmount: {
                __typename: 'MoneyV2',
                amount: 'loading...',
                currencyCode: cart.costs!.totalAmount.currencyCode
              },
              totalTaxAmount: {
                __typename: 'MoneyV2',
                amount: 'loading...',
                currencyCode: cart.costs!.totalAmount.currencyCode
              },
              totalDutyAmount: {
                __typename: 'MoneyV2',
                amount: 'loading...',
                currencyCode: cart.costs!.totalAmount.currencyCode
              },
              subtotalAmount: {
                __typename: 'MoneyV2',
                amount: 'loading...',
                currencyCode: cart.costs!.subtotalAmount.currencyCode
              }
            }
          }
        }
      }
    }
*/
