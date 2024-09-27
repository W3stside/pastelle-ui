import { useDebouncedChangeHandler } from '@past3lle/hooks'
import { ChangeEventHandler, useCallback, useState } from 'react'
import { Trash2 } from 'react-feather'
import { RED } from '@/theme'
import { QuantitySelectorWrapper } from './styled'

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
    ({ isDisabled, color }: { isDisabled?: boolean; color?: string | null }) => {
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
              value={debouncedQuantity as number}
            />
          )}
          {/* + */}
          <button disabled={isDisabled || quantity === PURCHASE_LIMIT} onClick={handleOnClickUp}>
            +
          </button>
          {!isDisabled && (onTrashClick ? <Trash2 onClick={onTrashClick} color={RED} size={'2rem'} /> : null)}
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
