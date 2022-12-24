import Button, { ButtonVariations, ButtonSizeVariations, ButtonProps } from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import { LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import { ProductDescription } from 'pages/common/styleds'
import { ForwardedRef, forwardRef, useCallback, useEffect, useState } from 'react'
import { useAddLineToCartAndUpdateReduxCallback } from 'state/cart/hooks'

import styled from 'styled-components/macro'

export type AddToCartButtonParams = {
  label?: string
  merchandiseId: string | undefined
  quantity: number
  buttonProps?: ButtonProps
}

const DisappearingMessageWrapper = styled(ProductDescription)`
  background-color: ${({ theme }) => theme.offWhiteOpaque1};
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
    message
  }
}

const AddToCartButton = forwardRef(function AddToCartButtonNoRef(
  { label = 'Add to cart', merchandiseId, quantity, buttonProps = {} }: AddToCartButtonParams,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const { addLineToCartCallback, loading, error } = useAddLineToCartAndUpdateReduxCallback()
  const { message: disappearingMessage, shouldShow, setShow } = useDisappearingMessage({ message: 'Added to cart!' })

  const isDisabled = loading || !quantity || shouldShow

  return (
    <>
      <Button
        ref={forwardedRef}
        onClick={() => {
          setShow(true)
          addLineToCartCallback({ quantity, merchandiseId })
        }}
        disabled={isDisabled}
        variant={ButtonVariations.THEME}
        $size={ButtonSizeVariations.SMALL}
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
    </>
  )
})

export default AddToCartButton
