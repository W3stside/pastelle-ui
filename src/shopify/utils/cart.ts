import { MutationHookOptions, MutationTuple } from '@apollo/client'
import {
  AddNewCartLineMutation,
  AddNewCartLineMutationVariables,
  RemoveCartLineMutation,
  RemoveCartLineMutationVariables,
  UpdateCartLineMutation,
  UpdateCartLineMutationVariables,
} from '@/shopify/graphql/types'
import { UpdateCartInfoParams } from '@/state/cart/reducer'

type BaseParams = {
  cartId: string | undefined
  quantity: number
  options?: MutationHookOptions
  updateCartInfo: (params: UpdateCartInfoParams) => {
    payload: UpdateCartInfoParams
    type: string
  }
}

export type RemoveLineParams = Omit<BaseParams, 'quantity'> & {
  lineIds: string[]
  removeCartLine: MutationTuple<RemoveCartLineMutation, RemoveCartLineMutationVariables>[0]
}

export type UpdateLineParams = BaseParams & {
  lineId: string
  updateCartLine: MutationTuple<UpdateCartLineMutation, UpdateCartLineMutationVariables>[0]
}

export type AddNewLineParams = BaseParams & {
  merchandiseId: string | undefined
  addNewCartLine: MutationTuple<AddNewCartLineMutation, AddNewCartLineMutationVariables>[0]
}

export const addCartLineAndUpdateStore = async ({
  cartId,
  quantity,
  merchandiseId,
  options,
  addNewCartLine,
  updateCartInfo,
}: AddNewLineParams) => {
  if (!cartId || !merchandiseId) return

  const response = await addNewCartLine({
    ...options,
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }],
    },
  })

  const totalQuantity = response?.data?.cartLinesAdd?.cart?.totalQuantity
  const costs = response.data?.cartLinesAdd?.cart?.cost

  updateCartInfo({ cartId, totalQuantity, costs })
}

export const removeCartLineAndUpdateStore = async ({
  cartId,
  lineIds,
  options,
  removeCartLine,
  updateCartInfo,
}: RemoveLineParams) => {
  if (!cartId || !lineIds) return

  const response = await removeCartLine({
    ...options,
    variables: {
      cartId,
      lineIds,
    },
  })

  const totalQuantity = response.data?.cartLinesRemove?.cart?.totalQuantity
  const costs = response.data?.cartLinesRemove?.cart?.cost

  updateCartInfo({ cartId, totalQuantity, costs })
}

export const updateCartLineAndUpdateStore = async ({
  cartId,
  quantity,
  lineId,
  options,
  updateCartLine,
  updateCartInfo,
}: UpdateLineParams) => {
  if (!cartId || !lineId) return

  const response = await updateCartLine({
    ...options,
    variables: {
      cartId,
      lineId,
      quantity,
    },
  })

  const totalQuantity = response.data?.cartLinesUpdate?.cart?.totalQuantity
  const costs = response.data?.cartLinesUpdate?.cart?.cost

  updateCartInfo({ cartId, totalQuantity, costs })
}
