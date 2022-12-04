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
    prev,
    itemSize,
    visible,
    currentIndex,
    firstPaintOver,
    scrollingZoneTarget,
    callbacks: { setCurrentIndex, setFirstPaintOver, ...restCbs }
  } = useScrollingAnimationSetup(items, {
    ...options,
    scaleOptions: {
      initialScale: 1
    },
    axisDirection: 'x'
  })

  const [springs, api] = useSprings(items.length, i => ({
    x: (i < items.length - 1 ? i : -1) * itemSize,
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

  useDrag(
    ({ event, active, dragging, offset: [x], direction: [dx] }) => {
      event.preventDefault()

      runSprings(api, items.length, itemSize, setCurrentIndex, {
        axis: -x / (options.scrollSpeed || DRAG_SPEED_COEFFICIENT),
        visible,
        snapOnScroll: options.snapOnScroll,
        prev,
        dAxis: -dx,
        axisDirection: 'x',
        active: !!(active || dragging),
        scaleOptions: {
          initialScale: 1
        },
        config: options.config
      })
    },
    {
      target: scrollingZoneTarget,
      eventOptions: { passive: false },
      axis: 'x',
      filterTaps: true,
      pointer: {
        touch: true,
        lock: true
      }
    }
  )

  return {
    springs,
    api,
    target: scrollingZoneTarget,
    itemSize,
    currentIndex,
    firstPaintOver,
    ...restCbs
  }
}
