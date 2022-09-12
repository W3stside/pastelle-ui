import { useState, useCallback, ChangeEventHandler } from 'react'
import { Trash2 } from 'react-feather'
import styled from 'styled-components/macro'
import { Row } from 'components/Layout'
import { ThemeModes } from 'theme/styled'
import { getThemeColours } from 'theme/utils'
import useDebouncedChangeHandler from './useDebouncedChangeHandler'

export const QuantitySelectorWrapper = styled(Row)`
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
    border-radius: 0.5rem;
    margin: 0 0.5rem;
    background: ${({ theme }) => theme.black};
    color: ${({ theme }) => theme.offWhite};
    min-width: 3rem;
  }
  > button,
  > input {
    text-align: center;
    height: 100%;
    font-weight: 700;
    font-size: 1.6rem;
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

  const QuantitySelector = useCallback(() => {
    return (
      <QuantitySelectorWrapper>
        {/* - */}
        <button disabled={quantity === 1} onClick={handleOnClickDown}>
          -
        </button>
        <input type="number" onChange={handleInputChange} value={debouncedQuantity} />
        {/* + */}
        <button disabled={quantity === PURCHASE_LIMIT} onClick={handleOnClickUp}>
          +
        </button>
        {!!onTrashClick ? (
          <Trash2 onClick={onTrashClick} color={getThemeColours(ThemeModes.CHAMELEON).red1} size={'2rem'} />
        ) : (
          <span
            style={{
              color: getThemeColours(ThemeModes.CHAMELEON).black,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
            onClick={resetQuantity}
          >
            reset
          </span>
        )}
      </QuantitySelectorWrapper>
    )
  }, [debouncedQuantity, handleInputChange, handleOnClickDown, handleOnClickUp, quantity, resetQuantity, onTrashClick])

  return {
    quantity,
    QuantitySelector
  }
}
