import { FetchResult } from '@apollo/client'
import { AddNewCartLineMutation, UpdateCartLineMutation, RemoveCartLineMutation } from 'shopify/graphql/types'
import { UpdateCartInfoParams } from 'state/cart/reducer'

type BaseParams = {
  cartId: string | undefined
  quantity: number
  updateCartInfo: (
    params: UpdateCartInfoParams
  ) => {
    payload: UpdateCartInfoParams
    type: string
  }
}

export type RemoveLineParams = Omit<BaseParams, 'quantity'> & {
  lineIds: string[]
  removeCartLine: (
    ...params: any[]
  ) => Promise<FetchResult<RemoveCartLineMutation, Record<string, any>, Record<string, any>>>
}

export type UpdateLineParams = BaseParams & {
  lineId: string
  updateCartLine: (
    ...params: any[]
  ) => Promise<FetchResult<UpdateCartLineMutation, Record<string, any>, Record<string, any>>>
}

export type AddNewLineParams = BaseParams & {
  merchandiseId: string | undefined
  addNewCartLine: (
    ...params: any[]
  ) => Promise<FetchResult<AddNewCartLineMutation, Record<string, any>, Record<string, any>>>
}

export const addCartLineAndUpdateStore = async ({
  cartId,
  quantity,
  merchandiseId,
  addNewCartLine,
  updateCartInfo
}: AddNewLineParams) => {
  if (!cartId || !merchandiseId) return

  const response = await addNewCartLine({
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }]
    }
  })

  const totalQuantity = response?.data?.cartLinesAdd?.cart?.totalQuantity
  const costs = response.data?.cartLinesAdd?.cart?.cost

  updateCartInfo({ totalQuantity, costs })
}

export const removeCartLineAndUpdateStore = async ({
  cartId,
  lineIds,
  removeCartLine,
  updateCartInfo
}: RemoveLineParams) => {
  if (!cartId || !lineIds) return

  const response = await removeCartLine({
    variables: {
      cartId,
      lineIds
    }
  })

  const totalQuantity = response.data?.cartLinesRemove?.cart?.totalQuantity
  const costs = response.data?.cartLinesRemove?.cart?.cost

  updateCartInfo({ totalQuantity, costs })
}

export const updateCartLineAndUpdateStore = async ({
  cartId,
  quantity,
  lineId,
  updateCartLine,
  updateCartInfo
}: UpdateLineParams) => {
  if (!cartId || !lineId) return

  const response = await updateCartLine({
    variables: {
      cartId,
      lineId,
      quantity
    }
  })

  const totalQuantity = response.data?.cartLinesUpdate?.cart?.totalQuantity
  const costs = response.data?.cartLinesUpdate?.cart?.cost

  updateCartInfo({ totalQuantity, costs })
}
