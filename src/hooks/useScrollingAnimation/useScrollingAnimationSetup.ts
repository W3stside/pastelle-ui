import useStateRef from 'hooks/useStateRef'
import { useState, useRef, useEffect } from 'react'
import { useGetWindowSize } from 'state/window/hooks'
import { AnimationHookParams } from './types'

export default function useScrollingAnimationSetup(
  items: any[],
  {
    axisDirection,
    // snap nearest screen after scroll end
    snapOnScroll = false,
    // items visible on screen
    visible = 1,
    // fixed itemSize - bypasses useRef
    // width or height
    sizeOptions: { fixedSize, minSize }
  }: AnimationHookParams
) {
  const isVertical = axisDirection === 'y'

  const size = useGetWindowSize()
  const [firstPaintOver, setFirstPaintOver] = useState(false)
  const [scrollingZoneTarget, setScrollingZoneRef] = useStateRef(null, node => node)

  const prev = useRef([0, 1])
  const [currentIndex, setCurrentIndex] = useState(prev.current[0])

  // width or height
  const [itemSize, setItemSizeRef] = useStateRef<number>(
    0,
    // width or height
    node => fixedSize || Math.min(isVertical ? node?.clientHeight : node?.clientWidth, minSize) || 0
  )

  // update size ref on window size changes
  useEffect(() => {
    // width or height
    if (!fixedSize && (isVertical ? scrollingZoneTarget?.clientHeight : scrollingZoneTarget?.clientWidth)) {
      setItemSizeRef(scrollingZoneTarget)
    }
  }, [fixedSize, setItemSizeRef, size, scrollingZoneTarget, axisDirection, isVertical])

  return {
    prev,
    visible,
    itemSize,
    snapOnScroll,
    currentIndex,
    firstPaintOver,
    scrollingZoneTarget,
    callbacks: {
      setCurrentIndex,
      setFirstPaintOver,
      setScrollingZoneRef,
      setItemSizeRef
    }
  }
}
