import { useCallback } from 'react'
import Button, { ButtonVariations, ButtonSizeVariations } from 'components/Button'
import { ItemDescription } from 'pages/SingleItem/styleds'
import { useAddNewCartLine } from 'shopify/graphql/hooks'
import { useGetCartIdDispatch, useUpdateCartInfoDispatch } from 'state/cart/hooks'
import { addCartLineAndUpdateStore } from 'shopify/utils/cart'

export type AddToCartButtonParams = { label?: string; merchandiseId: string | undefined; quantity: number }
export default function AddToCartButton({ label = 'Add to cart', merchandiseId, quantity }: AddToCartButtonParams) {
  const cartId = useGetCartIdDispatch()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const [addNewCartLine] = useAddNewCartLine()

  const callback = useCallback(
    e => addCartLineAndUpdateStore(e, { cartId, quantity, merchandiseId, addNewCartLine, updateCartInfo }),
    [addNewCartLine, cartId, quantity, merchandiseId, updateCartInfo]
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
