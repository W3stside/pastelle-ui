import { useRef } from 'react'
import { useGesture } from '@use-gesture/react'
import { useSprings } from 'react-spring'
import { InfiniteScrollHookOptions, SizeOptions } from './types'
import useInfiniteScrollSetup from './utils/useScrollSetup'
import { getNearestAxisPoint, runInfiniteScrollSprings } from './utils/utils'

const CONFIG = {
  SCROLL_SPEED_COEFFICIENT: 3.2,
  DRAG_SPEED_COEFFICIENT: 0.5
}
// const MAC_SPRING_CONFIG: SpringConfig = { friction: 90, tension: 280 }
// const MOBILE_SPRING_CONFIG: SpringConfig = { friction: 20, tension: 50, mass: 1 }

export default function useInfiniteVerticalScroll(
  items: any[],
  options: InfiniteScrollHookOptions,
  sizeOptions: SizeOptions
) {
  const {
    gestureParams,
    currentIndex,
    firstPaintOver,
    // scrollingZoneTarget,
    callbacks: { setFirstPaintOver, ...restCbs }
  } = useInfiniteScrollSetup('y', sizeOptions, options)

  const [springs, api] = useSprings(
    items.length,
    i => ({
      scale: options.scaleOptions.initialScale || 0.92,
      y: (i < items.length - 1 ? i : -1) * gestureParams.itemSize,
      onRest: () => {
        // useful in knowing when the FIRST animation has ended
        // like for setup
        if (!firstPaintOver) {
          setFirstPaintOver(true)
        }
      },
      from: {
        scale: options.scaleOptions.initialScale || 0.92,
        y: i * gestureParams.itemSize
      }
    }),
    [gestureParams.itemSize]
  )

  const wheelOffset = useRef(0)
  const dragOffset = useRef(0)

  const bind = useGesture(
    {
      onDrag: ({ active, last, offset: [, y], movement: [, my], direction: [, dy] }) => {
        if (dy) {
          const aY = getNearestAxisPoint(y, gestureParams.itemSize)
          dragOffset.current = -aY ?? -y
          const computedY = wheelOffset.current + -y / CONFIG.DRAG_SPEED_COEFFICIENT
          runInfiniteScrollSprings(api, 'y', {
            ...gestureParams,
            dataLength: items.length,
            active,
            axis: computedY,
            dAxis: -dy,
            mAxis: -my,
            last
          })
        }
      },
      onWheel: ({ active, last, offset: [, y], movement: [, my], direction: [, dy] }) => {
        if (dy) {
          wheelOffset.current = y
          const computedY = dragOffset.current + y / CONFIG.SCROLL_SPEED_COEFFICIENT
          runInfiniteScrollSprings(api, 'y', {
            ...gestureParams,
            dataLength: items.length,
            active,
            axis: computedY,
            dAxis: dy,
            mAxis: my,
            last
          })
        }
      }
    },
    {
      eventOptions: { passive: false, once: true, capture: false }
    }
  )

  return {
    bind,
    springs,
    api,
    itemSize: gestureParams.itemSize,
    currentIndex,
    firstPaintOver,
    ...restCbs
  }
}
