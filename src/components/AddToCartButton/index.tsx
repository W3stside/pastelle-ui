import Button, { ButtonVariations, ButtonSizeVariations } from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import { ItemDescription } from 'pages/SingleItem/styleds'
import { transparentize } from 'polished'
import { useCallback, useEffect, useState } from 'react'
import { useAddLineToCartAndUpdateReduxCallback } from 'state/cart/hooks'

import styled from 'styled-components/macro'

export type AddToCartButtonParams = { label?: string; merchandiseId: string | undefined; quantity: number }
export default function AddToCartButton({ label = 'Add to cart', merchandiseId, quantity }: AddToCartButtonParams) {
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
        variant={!isDisabled ? ButtonVariations.SUCCESS : ButtonVariations.DISABLED}
        size={ButtonSizeVariations.SMALL}
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
  background-color: ${({ theme }) => transparentize(0.15, theme.offWhite)};
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
