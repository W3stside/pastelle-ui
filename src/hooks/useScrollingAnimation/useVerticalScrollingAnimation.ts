import { useRef } from 'react'
import { isMobile } from 'react-device-detect'
import { useGesture } from '@use-gesture/react'
import { useSprings } from 'react-spring'
import { AnimationHookParams } from './types'
import useScrollingAnimationSetup from './useScrollingAnimationSetup'
import { getNearestAxisPoint, runSprings } from './utils'

const CONFIG = {
  SCROLL_SPEED_COEFFICIENT: 3.2,
  DRAG_SPEED_COEFFICIENT: 0.5
}
// const MAC_SPRING_CONFIG: SpringConfig = { friction: 90, tension: 280 }
// const MOBILE_SPRING_CONFIG: SpringConfig = { friction: 20, tension: 50, mass: 1 }

export default function useVerticalScrollingAnimation(
  items: any[],
  options: Omit<AnimationHookParams, 'axisDirection'>
) {
  const {
    prev,
    itemSize: itemHeight,
    visible,
    currentIndex,
    firstPaintOver,
    scrollingZoneTarget,
    callbacks: { setCurrentIndex, setFirstPaintOver, ...restCbs }
  } = useScrollingAnimationSetup(items, { ...options, axisDirection: 'y' })

  const [springs, api] = useSprings(
    items.length,
    i => ({
      scale: options.scaleOptions.initialScale || 0.92,
      y: (i < items.length - 1 ? i : -1) * itemHeight,
      onRest: () => {
        // useful in knowing when the FIRST animation has ended
        // like for setup
        if (!firstPaintOver) {
          setFirstPaintOver(true)
        }
      }
      // config: options.config || isMobile ? MOBILE_SPRING_CONFIG : MAC_SPRING_CONFIG
    }),
    [itemHeight]
  )

  const wheelOffset = useRef(0)
  const dragOffset = useRef(0)
  useGesture(
    {
      onDrag: ({ active, offset: [, y], movement: [, my], direction: [, dy] }) => {
        if (dy) {
          const aY = getNearestAxisPoint(y, itemHeight)
          dragOffset.current = -aY ?? -y
          const computedY = wheelOffset.current + -y / CONFIG.DRAG_SPEED_COEFFICIENT
          runSprings(api, items.length, itemHeight, setCurrentIndex, {
            axis: computedY,
            dAxis: -dy,
            mAxis: -my,
            active,
            visible,
            prev,
            scaleOptions: options.scaleOptions,
            axisDirection: 'y',
            config: options.config
          })
        }
      },
      onWheel: ({ event, active, offset: [, y], movement: [, my], direction: [, dy] }) => {
        event.preventDefault()

        if (dy) {
          const aY = getNearestAxisPoint(y, itemHeight)
          wheelOffset.current = aY ?? y
          const computedY = dragOffset.current + y / CONFIG.SCROLL_SPEED_COEFFICIENT
          runSprings(api, items.length, itemHeight, setCurrentIndex, {
            axis: computedY,
            dAxis: dy,
            mAxis: my,
            active,
            visible,
            prev,
            scaleOptions: options.scaleOptions,
            axisDirection: 'y',
            config: options.config
          })
        }
      }
    },
    {
      target: scrollingZoneTarget,
      eventOptions: { passive: false },
      drag: isMobile
        ? {
            filterTaps: true,
            axis: 'y',
            pointer: {
              touch: true,
              lock: true
            }
          }
        : undefined
    }
  )

  return {
    springs,
    api,
    target: scrollingZoneTarget,
    itemHeight,
    currentIndex,
    firstPaintOver,
    ...restCbs
  }
}
