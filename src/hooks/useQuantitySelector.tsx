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

  > *:not(input[type='number']) {
    cursor: pointer;
  }

  > input[type='number'] {
    text-align: center;
  }
`
const PURCHASE_LIMIT = 99
export default function useQuantitySelector() {
  const [quantity, setQuantity] = useState(1)
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
      if (value < 0 || value > PURCHASE_LIMIT) return
      return debouncedSetQuantity(value)
    },
    [debouncedSetQuantity]
  )
  const resetQuantity = useCallback(() => debouncedSetQuantity(0), [debouncedSetQuantity])

  const QuantitySelector = useCallback(() => {
    return (
      <QuantitySelectorWrapper>
        {/* - */}
        <button onClick={handleOnClickDown}>-</button>
        <input type="number" onChange={handleInputChange} value={debouncedQuantity} />
        {/* + */}
        <button onClick={handleOnClickUp}>+</button>
        <Trash2 onClick={resetQuantity} color={getThemeColours(ThemeModes.CHAMELEON).red1} size={'2rem'} />
      </QuantitySelectorWrapper>
    )
  }, [debouncedQuantity, resetQuantity, handleInputChange, handleOnClickDown, handleOnClickUp])

  return {
    quantity,
    QuantitySelector
  }
}
