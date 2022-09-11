import { FetchResult } from '@apollo/client'
import { useCallback } from 'react'
import Button, { ButtonVariations, ButtonSizeVariations } from 'components/Button'
import { ItemDescription } from 'pages/SingleItem/styleds'
import { useAddNewCartLine } from 'shopify/graphql/hooks'
import { AddNewCartLineMutation, CartMutationCartLinesAdd } from 'shopify/graphql/types'
import { useGetCartIdDispatch, useUpdateCartInfoDispatch } from 'state/cart/hooks'

function _getCartProp(response: FetchResult<AddNewCartLineMutation, Record<string, any>, Record<string, any>>) {
  const cartLinesAdd: CartMutationCartLinesAdd = response.data?.cartLinesAdd

  return cartLinesAdd?.cart
}

export type AddToCartButtonParams = { label?: string; merchandiseId: string | undefined; quantity: number }
export default function AddToCartButton({ label = 'Add to cart', merchandiseId, quantity }: AddToCartButtonParams) {
  const cartId = useGetCartIdDispatch()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const [addNewCartLine] = useAddNewCartLine()

  const callback = useCallback(
    async e => {
      e.preventDefault()
      if (!cartId || !merchandiseId) return

      const response = await addNewCartLine({
        variables: {
          cartId,
          lines: [{ merchandiseId, quantity }]
        }
      })

      const totalQuantity = _getCartProp(response)?.totalQuantity
      const costs = _getCartProp(response)?.cost
      updateCartInfo({ totalQuantity, costs })
    },
    [addNewCartLine, cartId, merchandiseId, quantity, updateCartInfo]
  )

  return (
    <Button
      onClick={callback}
      disabled={!quantity}
      variant={quantity ? ButtonVariations.SUCCESS : ButtonVariations.DISABLED}
      size={ButtonSizeVariations.SMALL}
    >
      <ItemDescription backgroundColor="transparent" padding="10px">
        {label}
      </ItemDescription>
    </Button>
  )
}
