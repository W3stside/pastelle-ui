import useStateRef from 'hooks/useStateRef'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useGetWindowSize } from 'state/window/hooks'
import { InfiniteScrollHookOptions, SizeOptions } from './types'

export default function useInfiniteScrollSetup(
  axisDirection: 'x' | 'y',
  sizeOptions: SizeOptions,
  options: InfiniteScrollHookOptions
) {
  const [firstPaintOver, setFirstPaintOver] = useState(false)
  const [scrollingZoneTarget, setScrollingZoneRef] = useStateRef(null, node => node)

  const prevRef = useRef([0, 1])
  const [currentIndex, setCurrentIndex] = useState(prevRef.current[0])

  // width or height
  const isVertical = axisDirection === 'y'
  const [itemSize, setItemSizeRef] = useStateRef<number>(
    0,
    // width or height
    node =>
      sizeOptions?.fixedSize || Math.min(isVertical ? node?.clientHeight : node?.clientWidth, sizeOptions.minSize) || 0
  )

  // update size ref on window size changes
  const size = useGetWindowSize()
  useEffect(() => {
    // width or height
    if (
      !sizeOptions?.fixedSize &&
      (isVertical ? scrollingZoneTarget?.clientHeight : scrollingZoneTarget?.clientWidth)
    ) {
      setItemSizeRef(scrollingZoneTarget)
    }
  }, [sizeOptions, setItemSizeRef, size, scrollingZoneTarget, axisDirection, isVertical])

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
