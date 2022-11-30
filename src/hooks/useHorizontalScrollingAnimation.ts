import { useRef, useEffect, useCallback, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useGesture } from '@use-gesture/react'
import { SpringConfig, useSprings } from 'react-spring'
import useStateRef from 'hooks/useStateRef'
import { useGetWindowSize } from 'state/window/hooks'

const CONFIG = {
  SCROLL_SPEED_COEFFICIENT: 3.2,
  DRAG_SPEED_COEFFICIENT: 1.3
}
const MAC_SPRING_CONFIG: SpringConfig = { friction: 90, tension: 280 }
// const WHEEL_SPRING_CONFIG: SpringConfig = { friction: 40, tension: 100 }
// const MOBILE_SPRING_CONFIG: SpringConfig = { friction: 30, tension: 280, clamp: true, mass: 1 }
const MOBILE_SPRING_CONFIG: SpringConfig = { friction: 10, tension: 200, clamp: true }
/**
 *
 * @param a input
 * @param b constraint 1 (can be low or high)
 * @param c constraint 2 (can be low or high)
 * @returns number closer to b or c
 */
const _closerTo = (a: number, b: number, c: number) => (Math.abs(c - a) >= Math.abs(b - a) ? b : c)
function _getLimits(point: number, mult: number): number[] {
  const range = point / mult
  const highPoint = mult * Math.ceil(range)
  const bounds = [highPoint - mult, highPoint]

  return bounds
}
function _calcAnchorPos(point: number, mult: number) {
  const [limitA, limitB] = _getLimits(point, mult)

  return _closerTo(point, limitA, limitB)
}

function _getNearestAxisPoint(point: number, multiple: number) {
  const anchorPoint = _calcAnchorPos(point, multiple)

  return anchorPoint
}
interface ScrollSpringParams {
  i: number
  x: number
  dx: number
  mx: number
  active: boolean
  firstVis: number
  firstVisIdx: number
}

const MINIMUM_COLLECTION_ITEM_HEIGHT = 773

export default function useHorizontalScrollingAnimation(
  items: any[],
  {
    visible = 1,
    // fixed itemWidth - bypasses useRef
    fixedItemWidth,
    // minimum itemWidth to render collection
    minItemHeight = MINIMUM_COLLECTION_ITEM_HEIGHT,
    // snap nearest screen after scroll end
    snapOnScroll = false,
    scaleOptions = {
      scaleOnScroll: 1,
      initialScale: 1
    }
  }: {
    scale?: number
    visible: number
    fixedItemWidth?: number
    minItemHeight?: number
    snapOnScroll?: boolean
    scaleOptions?: {
      scaleOnScroll?: number
      initialScale: number
    }
  }
) {
  const prev = useRef([0, 1])

  const [scrollingZoneTarget, setScrollingZoneRef] = useStateRef(null, node => node)
  const [itemWidth, setWidthRef] = useStateRef<number>(
    0,
    node => fixedItemWidth || Math.min(node?.clientHeight, minItemHeight) || 0
  )

  // handle window resizing
  const size = useGetWindowSize()

  useEffect(() => {
    if (!fixedItemWidth && scrollingZoneTarget?.clientHeight) {
      setWidthRef(scrollingZoneTarget)
    }
  }, [fixedItemWidth, setWidthRef, size, scrollingZoneTarget])

  const [currentIndex, setCurrentIndex] = useState(prev.current[0])
  const [firstPaintOver, setFirstPaintOver] = useState(false)

  const [springs, api] = useSprings(
    items.length,
    i => {
      const lastItemIndex = items.length - 1
      const referenceIndex = i > lastItemIndex ? -1 : i
      return {
        scale: scaleOptions.initialScale,
        // if current item index is GREATER than array length
        // then we
        x: referenceIndex * itemWidth,
        onRest: () => {
          // useful in knowing when the FIRST animation has ended
          // like for setup
          if (!firstPaintOver) {
            setFirstPaintOver(true)
          }
        },
        config: MOBILE_SPRING_CONFIG
      }
    },
    [itemWidth]
  )

  const getIndex = useCallback((x: number, l = items.length) => (x < 0 ? x + l : x) % l, [items])
  const getPos = useCallback(
    (i: number, firstVisible: number, firstVisibleIndex: number) => getIndex(i - firstVisible + firstVisibleIndex),
    [getIndex]
  )

  const calculateApiLogic = useCallback(
    ({ i, x, dx, mx, active, firstVis, firstVisIdx }: ScrollSpringParams) => {
      const position = getPos(i, firstVis, firstVisIdx)
      const prevPosition = getPos(i, prev.current[0], prev.current[1])
      const rank = firstVis - (x < 0 ? items.length : 0) + position - firstVisIdx

      // const configPos = dx > 0 ? position : items.length - position
      const xPos = (-x % (itemWidth * items.length)) + itemWidth * rank
      const scale =
        scaleOptions?.scaleOnScroll && !isMobile && active
          ? Math.max(1 - Math.abs(mx) / itemWidth / 2, scaleOptions.scaleOnScroll)
          : scaleOptions.initialScale

      const anchorPoint = _getNearestAxisPoint(xPos, itemWidth)

      // the frame at the 0 anchor point is the current one in frame
      // set it as the current index - sets header, nav, etc
      if (anchorPoint === 0) {
        setCurrentIndex(i)
      }

      return {
        x: active || !snapOnScroll ? xPos : anchorPoint,
        scale,
        immediate: dx < 0 ? prevPosition > position : prevPosition < position,
        // set configs based on intertial vs non-intertial scroll
        // s === false means intertial
        config: MOBILE_SPRING_CONFIG // WHEEL_SPRING_CONFIG
      }
    },
    [getPos, itemWidth, items.length, scaleOptions, snapOnScroll]
  )

  const runSprings = useCallback(
    (x: number, dx: number, mx: number, active: boolean) => {
      const itemPosition = Math.floor(x / itemWidth) % items.length
      const firstVis = getIndex(itemPosition)
      const firstVisIdx = dx < 0 ? items.length - visible - 1 : 0

      api.start(i => calculateApiLogic({ i, x, dx, mx, active, firstVis, firstVisIdx }))

      prev.current = [firstVis, firstVisIdx]
    },
    [itemWidth, items.length, getIndex, visible, api, calculateApiLogic]
  )

  const dragOffset = useRef(0)

  useGesture(
    {
      onDrag: ({ active, offset: [x], movement: [mx], direction: [dx] }) => {
        if (dx) {
          //   const aX = _getNearestAxisPoint(x, itemWidth)
          dragOffset.current = -x
          const computedX = dragOffset.current + -x / CONFIG.DRAG_SPEED_COEFFICIENT
          runSprings(computedX, -dx, -mx, active)
        }
      }
    },
    {
      target: scrollingZoneTarget,
      eventOptions: { passive: false },
      drag: {
        axis: 'x',
        filterTaps: true,
        pointer: {
          touch: true,
          lock: true
        }
      }
    }
  )

  return {
    springs,
    api,
    target: scrollingZoneTarget,
    itemWidth,
    currentIndex,
    firstPaintOver,
    setWidthRef,
    setScrollingZoneRef
  }
}
