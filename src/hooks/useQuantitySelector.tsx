import { Row } from '@past3lle/components'
import { useDebouncedChangeHandler } from '@past3lle/hooks'
import { BLACK, setBestTextColour } from '@past3lle/theme'
import { ChangeEventHandler, useCallback, useState } from 'react'
import { Trash2 } from 'react-feather'
import styled from 'styled-components/macro'
import { RED } from 'theme'

export const QuantitySelectorWrapper = styled(Row)<{ color?: string }>`
  width: 100%;
  min-height: 6rem;

  align-items: stretch;
  justify-content: center;
  padding: 1rem;

  > button {
    &:disabled {
      background: dimgrey;
      cursor: not-allowed;
      color: #000;
    }
    border: none;
    border-radius: 0.1rem;
    margin: 0 0.5rem;
    background-color: ${({ color = BLACK }) => color};
    color: ${({ color = BLACK }) => setBestTextColour(color)};
    min-width: 3rem;

    &:first-of-type:not(:disabled) {
      background: none;
      background-color: ${({ theme }) => theme.red3};
    }
  }

  > button,
  > input {
    text-align: center;
    font-weight: 200;
    font-size: 1.6rem;
    outline: none;
  }

  > input {
    font-weight: 400;
    background-color: ${({ theme }) => theme.content.background};
    color: ${({ theme }) => theme.content.text};
  }

  > svg {
    align-self: center;
  }

  > *:not(input[type='number']):not(button:disabled) {
    cursor: pointer;
  }

  #reset-button {
    color: ${({ theme }) => theme.content.text};
    text-decoration: underline;
    cursor: pointer;
    padding: 0.1rem;
    background-color: ${({ theme }) => theme.offwhiteOpaqueMost};
  }
`
export interface QuantitySelectorParams {
  defaultQuantity?: number
  onTrashClick?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void | Promise<void>
  options?: { numberInput: boolean }
}
const PURCHASE_LIMIT = 99
export default function useQuantitySelector({ defaultQuantity = 1, onTrashClick, options }: QuantitySelectorParams) {
  const [quantity, setQuantity] = useState(defaultQuantity)
  const [debouncedQuantity, debouncedSetQuantity] = useDebouncedChangeHandler(quantity, setQuantity)

  const handleOnClickDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation()

      if (quantity === 0) return
      return setQuantity((state) => state - 1)
    },
    [quantity]
  )
  const handleOnClickUp = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation()

      if (quantity === PURCHASE_LIMIT) return
      return setQuantity((state) => state + 1)
    },
    [quantity]
  )
  const handleInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      e.stopPropagation()

      const value = Number(e.target.value)
      if (value <= 0 || value > PURCHASE_LIMIT) return
      return debouncedSetQuantity(value)
    },
    [debouncedSetQuantity]
  )

  const QuantitySelector = useCallback(
    ({ isDisabled, color }: { isDisabled?: boolean; color?: string }) => {
      return (
        <QuantitySelectorWrapper color={color}>
          {/* - */}
          <button disabled={isDisabled || quantity === 1} onClick={handleOnClickDown}>
            -
          </button>
          {options?.numberInput && (
            <input
              disabled={isDisabled}
              type="number"
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()}
              value={debouncedQuantity}
            />
          )}
          {/* + */}
          <button disabled={isDisabled || quantity === PURCHASE_LIMIT} onClick={handleOnClickUp}>
            +
          </button>
          {!isDisabled && (!!onTrashClick ? <Trash2 onClick={onTrashClick} color={RED} size={'2rem'} /> : null)}
        </QuantitySelectorWrapper>
      )
    },
    [
      debouncedQuantity,
      handleInputChange,
      handleOnClickDown,
      handleOnClickUp,
      onTrashClick,
      options?.numberInput,
      quantity,
    ]
  )

  return {
    quantity,
    QuantitySelector,
  }
}
