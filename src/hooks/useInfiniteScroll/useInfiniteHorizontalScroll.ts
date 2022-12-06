import { useDrag } from '@use-gesture/react'
import { useSprings } from 'react-spring'
import useInfiniteScrollSetup from './useInfiniteScrollSetup'
import { InfiniteScrollHookOptions, SizeOptions } from './types'
import { runSprings } from './utils'

const DRAG_SPEED_COEFFICIENT = 0.5

export default function useInfiniteHorizontalScroll(
  items: any[],
  options: InfiniteScrollHookOptions,
  sizeOptions: SizeOptions
) {
  const {
    gestureParams,
    currentIndex,
    firstPaintOver,
    scrollingZoneTarget,
    callbacks: { setFirstPaintOver, ...restCbs }
  } = useInfiniteScrollSetup('x', sizeOptions, options)

  const [springs, api] = useSprings(items.length, i => ({
    x: (i < items.length - 1 ? i : -1) * gestureParams.itemSize,
    onRest() {
      if (!firstPaintOver) {
        return setFirstPaintOver(true)
      }
    },
    config: {
      tension: 260,
      friction: 50
    }
  }))

  const bind = useDrag(
    ({ active, dragging, offset: [x], direction: [dx] }) => {
      runSprings(api, 'x', {
        ...gestureParams,
        dataLength: items.length,
        axis: -x / (options.scrollSpeed || DRAG_SPEED_COEFFICIENT),
        dAxis: -dx,
        active: !!(active || dragging),
        config: options.config
      })
    },
    {
      // target: scrollingZoneTarget,
      eventOptions: { passive: false },
      preventDefault: true,
      axis: 'x',
      filterTaps: true
    }
  )

  return {
    springs,
    api,
    bind,
    target: scrollingZoneTarget,
    itemSize: gestureParams.itemSize,
    currentIndex,
    firstPaintOver,
    ...restCbs
  }
}
