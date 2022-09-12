import Button, { ButtonVariations, ButtonSizeVariations } from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import { ItemDescription } from 'pages/SingleItem/styleds'
import { transparentize } from 'polished'
import { useCallback, useEffect, useState } from 'react'
import { useAddToCartAndUpdateCallback } from 'state/cart/hooks'

import styled from 'styled-components/macro'

export type AddToCartButtonParams = { label?: string; merchandiseId: string | undefined; quantity: number }
export default function AddToCartButton({ label = 'Add to cart', merchandiseId, quantity }: AddToCartButtonParams) {
  const { addToCartCallback, loading, error } = useAddToCartAndUpdateCallback()
  const { DisappearingMessage, shouldShow, setShow } = useDisappearingMessage()

  const isDisabled = loading || !quantity || shouldShow

  return (
    <>
      <Button
        onClick={() => {
          setShow(true)
          addToCartCallback({ quantity, merchandiseId })
        }}
        disabled={isDisabled}
        variant={!isDisabled ? ButtonVariations.SUCCESS : ButtonVariations.DISABLED}
        size={ButtonSizeVariations.SMALL}
      >
        {shouldShow && !error ? (
          <DisappearingMessage />
        ) : (
          <ItemDescription color="inherit" backgroundColor="transparent" padding="10px">
            {loading ? 'Adding to cart...' : label}
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
function useDisappearingMessage(params?: { show: boolean }) {
  const [showMessage, setShow] = useState(!!params?.show)

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
          Item added to cart!
        </DisappearingMessageWrapper>
      ) : null,
    [showMessage]
  )
  return {
    DisappearingMessage,
    setShow,
    shouldShow: showMessage
  }
}
