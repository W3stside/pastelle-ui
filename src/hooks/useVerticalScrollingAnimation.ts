import { useRef, useEffect, useCallback, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useGesture } from '@use-gesture/react'
import { SpringConfig, useSprings } from 'react-spring'
import useStateRef from 'hooks/useStateRef'
import { useGetWindowSize } from 'state/window/hooks'

const CONFIG = {
  SCROLL_SPEED_COEFFICIENT: 3.2,
  DRAG_SPEED_COEFFICIENT: 0.5
}
const MAC_SPRING_CONFIG: SpringConfig = { friction: 90, tension: 280 }
// const WHEEL_SPRING_CONFIG: SpringConfig = { friction: 40, tension: 100 }
const MOBILE_SPRING_CONFIG: SpringConfig = { friction: 20, tension: 50, mass: 1 }
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
  y: number
  dy: number
  my: number
  active: boolean
  firstVis: number
  firstVisIdx: number
}

const MINIMUM_COLLECTION_ITEM_HEIGHT = 773

export default function useVerticalScrollingAnimation(
  items: any[],
  {
    visible = 1,
    // fixed itemHeight - bypasses useRef
    fixedItemHeight,
    // minimum itemHeight to render collection
    minItemHeight = MINIMUM_COLLECTION_ITEM_HEIGHT,
    // snap nearest screen after scroll end
    snapOnScroll = false,
    scaleOptions = {
      scaleOnScroll: 0.8,
      initialScale: 1
    }
  }: {
    scale?: number
    visible: number
    fixedItemHeight?: number
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
  const [itemHeight, setHeightRef] = useStateRef<number>(
    0,
    node => fixedItemHeight || Math.min(node?.clientHeight, minItemHeight) || 0
  )

  // handle window resizing
  const size = useGetWindowSize()

  useEffect(() => {
    if (!fixedItemHeight && scrollingZoneTarget?.clientHeight) {
      setHeightRef(scrollingZoneTarget)
    }
  }, [fixedItemHeight, setHeightRef, size, scrollingZoneTarget])

  const [currentIndex, setCurrentIndex] = useState(prev.current[0])
  const [firstPaintOver, setFirstPaintOver] = useState(false)

  const [springs, api] = useSprings(
    items.length,
    i => ({
      scale: scaleOptions.initialScale,
      y: (i < items.length - 1 ? i : -1) * itemHeight,
      onRest: () => {
        // useful in knowing when the FIRST animation has ended
        // like for setup
        if (!firstPaintOver) {
          setFirstPaintOver(true)
        }
      }
      // config: WHEEL_SPRING_CONFIG // MAC_SPRING_CONFIG
    }),
    [itemHeight]
  )

  const getIndex = useCallback((y: number, l = items.length) => (y < 0 ? y + l : y) % l, [items])
  const getPos = useCallback(
    (i: number, firstVisible: number, firstVisibleIndex: number) => getIndex(i - firstVisible + firstVisibleIndex),
    [getIndex]
  )

  const calculateApiLogic = useCallback(
    ({ i, y, dy, my, active, firstVis, firstVisIdx }: ScrollSpringParams) => {
      const position = getPos(i, firstVis, firstVisIdx)
      const prevPosition = getPos(i, prev.current[0], prev.current[1])
      const rank = firstVis - (y < 0 ? items.length : 0) + position - firstVisIdx

      // const configPos = dy > 0 ? position : items.length - position
      const yPos = (-y % (itemHeight * items.length)) + itemHeight * rank
      const scale =
        scaleOptions?.scaleOnScroll && !isMobile && active
          ? Math.max(1 - Math.abs(my) / itemHeight / 2, scaleOptions.scaleOnScroll)
          : scaleOptions.initialScale

      const anchorPoint = _getNearestAxisPoint(yPos, itemHeight)

      // the frame at the 0 anchor point is the current one in frame
      // set it as the current index - sets header, nav, etc
      if (anchorPoint === 0) {
        setCurrentIndex(i)
      }

      return {
        y: active || !snapOnScroll ? yPos : anchorPoint,
        scale,
        immediate: dy < 0 ? prevPosition > position : prevPosition < position,
        // set configs based on intertial vs non-intertial scroll
        // s === false means intertial
        config: isMobile ? MOBILE_SPRING_CONFIG : MAC_SPRING_CONFIG // WHEEL_SPRING_CONFIG
      }
    },
    [getPos, itemHeight, items.length, scaleOptions, snapOnScroll]
  )

  const runSprings = useCallback(
    (y: number, dy: number, my: number, active: boolean) => {
      const itemPosition = Math.floor(y / itemHeight) % items.length
      const firstVis = getIndex(itemPosition)
      const firstVisIdx = dy < 0 ? items.length - visible - 1 : 1

      api.start(i => calculateApiLogic({ i, y, dy, my, active, firstVis, firstVisIdx }))

      prev.current = [firstVis, firstVisIdx]
    },
    [itemHeight, items.length, getIndex, visible, api, calculateApiLogic]
  )

  const wheelOffset = useRef(0)
  const dragOffset = useRef(0)

  useGesture(
    {
      onDrag: ({ active, offset: [, y], movement: [, my], direction: [, dy] }) => {
        if (dy) {
          const aY = _getNearestAxisPoint(y, itemHeight)
          dragOffset.current = -aY ?? -y
          const computedY = wheelOffset.current + -y / CONFIG.DRAG_SPEED_COEFFICIENT
          runSprings(computedY, -dy, -my, active)
        }
      },
      onWheel: ({ event, active, offset: [, y], movement: [, my], direction: [, dy] }) => {
        event.preventDefault()

        if (dy) {
          const aY = _getNearestAxisPoint(y, itemHeight)
          wheelOffset.current = aY ?? y
          const computedY = dragOffset.current + y / CONFIG.SCROLL_SPEED_COEFFICIENT
          runSprings(computedY, dy, my, active)
        }
      }
    },
    {
      target: scrollingZoneTarget,
      eventOptions: { passive: false }
    }
  )

  return {
    springs,
    api,
    target: scrollingZoneTarget,
    itemHeight,
    currentIndex,
    firstPaintOver,
    setHeightRef,
    setScrollingZoneRef
  }
}
