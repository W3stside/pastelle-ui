import { useDrag } from '@use-gesture/react'
import { useSprings } from 'react-spring'
import useScrollingAnimationSetup from './useScrollingAnimationSetup'
import { AnimationHookParams } from './types'
import { runSprings } from './utils'

const DRAG_SPEED_COEFFICIENT = 0.5

export default function useHorizontalScrollingAnimation(
  items: any[],
  options: Omit<AnimationHookParams, 'axisDirection' | 'scaleOptions'>
) {
  const {
    springsParams,
    currentIndex,
    firstPaintOver,
    scrollingZoneTarget,
    callbacks: { setFirstPaintOver, ...restCbs }
  } = useScrollingAnimationSetup(items, {
    ...options,
    scaleOptions: {
      initialScale: 1
    },
    axisDirection: 'x'
  })

  const [springs, api] = useSprings(items.length, i => ({
    x: (i < items.length - 1 ? i : -1) * springsParams.itemSize,
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
      runSprings(api, items.length, springsParams.itemSize, springsParams.setCurrentIndex, {
        ...springsParams,
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
    itemSize: springsParams.itemSize,
    currentIndex,
    firstPaintOver,
    ...restCbs
  }
}
