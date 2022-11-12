import Button, { ButtonVariations, ButtonSizeVariations, ButtonProps } from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import { ItemDescription } from 'pages/SingleItem/styleds'
import { useCallback, useEffect, useState } from 'react'
import { useAddLineToCartAndUpdateReduxCallback } from 'state/cart/hooks'

import styled from 'styled-components/macro'

export type AddToCartButtonParams = {
  label?: string
  merchandiseId: string | undefined
  quantity: number
  buttonProps?: ButtonProps
}
export default function AddToCartButton({
  label = 'Add to cart',
  merchandiseId,
  quantity,
  buttonProps = {}
}: AddToCartButtonParams) {
  const { addLineToCartCallback, loading, error } = useAddLineToCartAndUpdateReduxCallback()
  const { message: disappearingMessage, shouldShow, setShow } = useDisappearingMessage({ message: 'Added to cart!' })

  const isDisabled = loading || !quantity || shouldShow

  return (
    <>
      <Button
        onClick={() => {
          setShow(true)
          addLineToCartCallback({ quantity, merchandiseId })
        }}
        disabled={isDisabled}
        variant={ButtonVariations.THEME}
        size={ButtonSizeVariations.SMALL}
        // override w/ button props if necessary
        {...buttonProps}
      >
        {!error && (
          <ItemDescription color="inherit" backgroundColor="transparent" padding="1rem">
            {loading ? 'Adding...' : shouldShow ? disappearingMessage : label}
          </ItemDescription>
        )}
      </Button>
      {error && <ErrorMessage error={error} />}
    </>
  )
}

const DisappearingMessageWrapper = styled(ItemDescription)`
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
