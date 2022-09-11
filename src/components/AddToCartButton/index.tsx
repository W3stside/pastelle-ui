import Button, { ButtonVariations, ButtonSizeVariations } from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import { ItemDescription } from 'pages/SingleItem/styleds'
import { useAddToCartAndUpdateCallback } from 'state/cart/hooks'

export type AddToCartButtonParams = { label?: string; merchandiseId: string | undefined; quantity: number }
export default function AddToCartButton({ label = 'Add to cart', merchandiseId, quantity }: AddToCartButtonParams) {
  const { addToCartCallback, loading, error } = useAddToCartAndUpdateCallback({ merchandiseId, quantity })

  const isDisabled = loading || !quantity

  return (
    <>
      <Button
        onClick={addToCartCallback}
        disabled={loading || !quantity}
        variant={!isDisabled ? ButtonVariations.SUCCESS : ButtonVariations.DISABLED}
        size={ButtonSizeVariations.SMALL}
      >
        <ItemDescription backgroundColor="transparent" padding="10px">
          {label}
        </ItemDescription>
      </Button>
      {error && <ErrorMessage error={error} />}
    </>
  )
}
