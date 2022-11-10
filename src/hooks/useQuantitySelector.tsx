import { useState, useCallback, ChangeEventHandler } from 'react'
import { Trash2 } from 'react-feather'
import styled from 'styled-components/macro'
import { Row } from 'components/Layout'
import useDebouncedChangeHandler from './useDebouncedChangeHandler'
import { BLACK, RED } from 'theme/utils'

export const QuantitySelectorWrapper = styled(Row)<{ color?: string }>`
  width: 100%;
  height: 6rem;

  justify-content: center;
  padding: 1rem;

  > button {
    &:disabled {
      background: lightgrey;
      cursor: not-allowed;
    }
    border: none;
    border-radius: 0.1rem;
    margin: 0 0.5rem;
    background-color: ${({ color = BLACK }) => color};
    color: ${({ theme }) => theme.offWhite};
    min-width: 3rem;

    &:first-child:not(:disabled) {
      background: none;
      background-color: ${({ theme }) => theme.red3};
    }
  }
  > button,
  > input {
    text-align: center;
    height: 100%;
    font-weight: 100;
    font-size: 1.6rem;
    outline: none;
  }

  > input {
    font-weight: 400;
  }

  > *:not(input[type='number']):not(button:disabled) {
    cursor: pointer;
  }
`
const PURCHASE_LIMIT = 99
export default function useQuantitySelector({
  defaultQuantity = 1,
  onTrashClick
}: {
  defaultQuantity?: number
  onTrashClick?: () => void | Promise<void>
}) {
  const [quantity, setQuantity] = useState(defaultQuantity)
  const [debouncedQuantity, debouncedSetQuantity] = useDebouncedChangeHandler(quantity, setQuantity)

  const handleOnClickDown = useCallback(() => {
    if (quantity === 0) return
    return setQuantity(state => state - 1)
  }, [quantity])
  const handleOnClickUp = useCallback(() => {
    if (quantity === PURCHASE_LIMIT) return
    return setQuantity(state => state + 1)
  }, [quantity])
  const handleInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const value = Number(e.target.value)
      if (value <= 0 || value > PURCHASE_LIMIT) return
      return debouncedSetQuantity(value)
    },
    [debouncedSetQuantity]
  )
  const resetQuantity = useCallback(() => debouncedSetQuantity(1), [debouncedSetQuantity])

  const QuantitySelector = useCallback(
    ({ isDisabled, color }: { isDisabled?: boolean; color?: string }) => {
      return (
        <QuantitySelectorWrapper color={color}>
          {/* - */}
          <button disabled={isDisabled || quantity === 1} onClick={handleOnClickDown}>
            -
          </button>
          <input disabled={isDisabled} type="number" onChange={handleInputChange} value={debouncedQuantity} />
          {/* + */}
          <button disabled={isDisabled || quantity === PURCHASE_LIMIT} onClick={handleOnClickUp}>
            +
          </button>
          {!isDisabled &&
            (!!onTrashClick ? (
              <Trash2 onClick={onTrashClick} color={RED} size={'2rem'} />
            ) : (
              <span
                style={{
                  color: BLACK,
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={resetQuantity}
              >
                reset
              </span>
            ))}
        </QuantitySelectorWrapper>
      )
    },
    [debouncedQuantity, handleInputChange, handleOnClickDown, handleOnClickUp, quantity, resetQuantity, onTrashClick]
  )

  return {
    quantity,
    QuantitySelector
  }
}
