import { useState, useRef, useMemo } from 'react'
import { AxisDirection, InfiniteScrollHookOptions, SizeOptions } from '../types'
import useScrollZoneRefs from './useScrollZoneRef'

export default function useInfiniteScrollSetup(
  axisDirection: AxisDirection,
  sizeOptions: SizeOptions,
  options: InfiniteScrollHookOptions
) {
  const [firstPaintOver, setFirstPaintOver] = useState(false)

  const prevRef = useRef([0, 1])
  const [currentIndex, setCurrentIndex] = useState(prevRef.current[0])

  const {
    refs: { itemSize, scrollingZoneTarget },
    refCallbacks: { setItemSizeRef, setScrollingZoneRef }
  } = useScrollZoneRefs(axisDirection, sizeOptions)

  const gestureParams = useMemo(() => ({ ...options, prevRef, itemSize, setCurrentIndex }), [itemSize, options])

  return {
    gestureParams,
    currentIndex,
    firstPaintOver,
    scrollingZoneTarget,
    callbacks: {
      setFirstPaintOver,
      setScrollingZoneRef,
      setItemSizeRef
    }
  }
}
