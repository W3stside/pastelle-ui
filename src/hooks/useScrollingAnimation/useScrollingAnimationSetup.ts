import useStateRef from 'hooks/useStateRef'
import { useState, useRef, useEffect } from 'react'
import { useGetWindowSize } from 'state/window/hooks'
import { AnimationHookParams } from './types'

export default function useScrollingAnimationSetup(items: any[], options: AnimationHookParams) {
  const isVertical = options.axisDirection === 'y'

  const size = useGetWindowSize()
  const [firstPaintOver, setFirstPaintOver] = useState(false)
  const [scrollingZoneTarget, setScrollingZoneRef] = useStateRef(null, node => node)

  const prevRef = useRef([0, 1])
  const [currentIndex, setCurrentIndex] = useState(prevRef.current[0])

  // width or height
  const [itemSize, setItemSizeRef] = useStateRef<number>(
    0,
    // width or height
    node =>
      options.sizeOptions.fixedSize ||
      Math.min(isVertical ? node?.clientHeight : node?.clientWidth, options.sizeOptions.minSize) ||
      0
  )

  // update size ref on window size changes
  useEffect(() => {
    // width or height
    if (
      !options.sizeOptions.fixedSize &&
      (isVertical ? scrollingZoneTarget?.clientHeight : scrollingZoneTarget?.clientWidth)
    ) {
      setItemSizeRef(scrollingZoneTarget)
    }
  }, [options.sizeOptions.fixedSize, setItemSizeRef, size, scrollingZoneTarget, options.axisDirection, isVertical])

  return {
    springsParams: { ...options, prevRef, itemSize, setCurrentIndex },
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
