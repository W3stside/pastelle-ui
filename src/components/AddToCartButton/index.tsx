import { Button, ButtonProps, ButtonSizeVariations, ButtonVariations, Row } from '@past3lle/components'
import { addToCartAnalytics } from 'analytics/events/cartEvents'
import ErrorMessage from 'components/ErrorMessage'
import { LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import { ProductDescription } from 'pages/common/styleds'
import { ForwardedRef, forwardRef, useCallback, useEffect, useState } from 'react'
import { ProductVariantQuery } from 'shopify/graphql/types'
import { useAddLineToCartAndUpdateReduxCallback } from 'state/cart/hooks'
import styled from 'styled-components/macro'

export type AddToCartButtonParams = {
  label?: string
  product: ProductVariantQuery['product']
  quantity: number
  buttonProps?: ButtonProps
}

const DisappearingMessageWrapper = styled(ProductDescription)`
  background-color: ${({ theme }) => theme.offwhiteOpaque};
  color: ${({ theme }) => theme.text1};
`
function useDisappearingMessage(params: { message: string; showAtStart?: boolean }) {
  const { message } = params
  const [showMessage, setShow] = useState(!!params?.showAtStart)

  useEffect(() => {
    const timeout = setTimeout(() => {
      showMessage && setShow(false)
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [showMessage])

  const DisappearingMessage = useCallback(
    () =>
      showMessage ? (
        <DisappearingMessageWrapper backgroundColor={'transparent'} padding="1rem">
          {message}
        </DisappearingMessageWrapper>
      ) : null,
    [showMessage, message]
  )
  return {
    DisappearingMessage,
    setShow,
    shouldShow: showMessage,
    message,
  }
}

const AddToCartButton = forwardRef(function AddToCartButtonNoRef(
  { label = 'Add to cart', product, quantity, buttonProps = {} }: AddToCartButtonParams,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const { addLineToCartCallback, loading, error } = useAddLineToCartAndUpdateReduxCallback()
  const { message: disappearingMessage, shouldShow, setShow } = useDisappearingMessage({ message: 'Added to cart!' })

  const isDisabled = loading || !quantity || shouldShow

  const handleAddToCart = useCallback(() => {
    addToCartAnalytics(product, quantity)
    setShow(true)
    addLineToCartCallback({ quantity, merchandiseId: product?.variantBySelectedOptions?.id })
  }, [addLineToCartCallback, product, quantity, setShow])

  return (
    <Row ref={forwardedRef} width="100%">
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        buttonVariant={ButtonVariations.THEME}
        buttonSize={ButtonSizeVariations.SMALL}
        height={LAYOUT_REM_HEIGHT_MAP.FIXED_ADD_TO_CART_BUTTON + 'rem'}
        // override w/ button props if necessary
        {...buttonProps}
      >
        {!error && (
          <ProductDescription
            color="inherit"
            backgroundColor="transparent"
            display={'flex'}
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            {loading ? 'Adding...' : shouldShow ? disappearingMessage : label}
          </ProductDescription>
        )}
      </Button>
      {error && <ErrorMessage error={error} />}
    </Row>
  )
})

export default AddToCartButton
