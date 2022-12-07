import useStateRef from 'hooks/useStateRef'
import { useEffect } from 'react'
import { useGetWindowSize } from 'state/window/hooks'
import { SizeOptions } from '../types'

export default function useScrollZoneRefs(axisDirection: 'x' | 'y', sizeOptions: SizeOptions) {
  const [scrollingZoneTarget, setScrollingZoneRef] = useStateRef<HTMLElement | null>(null, node => node)
  // width or height
  const isVertical = axisDirection === 'y'
  const [itemSize, setItemSizeRef] = useStateRef<number>(
    0,
    // width or height
    node =>
      sizeOptions?.fixedSize || Math.min(isVertical ? node?.clientHeight : node?.clientWidth, sizeOptions.minSize) || 0
  )
  useEffect(() => {
    const handler = (e: any) => e.preventDefault()
    scrollingZoneTarget?.addEventListener('wheel', handler)

    return () => {
      scrollingZoneTarget?.removeEventListener('wheel', handler)
    }
  }, [scrollingZoneTarget])

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

  return { refs: { scrollingZoneTarget, itemSize }, refCallbacks: { setScrollingZoneRef, setItemSizeRef } }
}
