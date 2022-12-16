import { useState, useRef, useMemo } from 'react'
import { AxisDirection, InfiniteScrollOptions } from '../types'
import useScrollZoneRefs from './useScrollZoneRef'

export default function useInfiniteScrollSetup(axisDirection: AxisDirection, options: InfiniteScrollOptions) {
  const [firstAnimationOver, setFirstPaintOver] = useState(false)

  const prevRef = useRef([0, 1])
  const [currentIndex, setCurrentIndex] = useState(prevRef.current[0])

  const {
    refs: { itemSize, scrollingZoneTarget },
    refCallbacks: { setItemSizeRef, setScrollingZoneRef }
  } = useScrollZoneRefs(axisDirection, options.sizeOptions)

  const gestureParams = useMemo(() => ({ ...options, prevRef, itemSize, setCurrentIndex }), [itemSize, options])

  return {
    gestureParams,
    currentIndex,
    firstAnimationOver,
    scrollingZoneTarget,
    callbacks: {
      setFirstPaintOver,
      setScrollingZoneRef,
      setItemSizeRef
    }
  }
}
