import { useState, useRef, useEffect, useCallback } from 'react'
import { useGesture } from '@use-gesture/react'
import { useSprings, SpringConfig } from '@react-spring/web'
import { FixedAnimatedLoader } from 'components/Loader'
import { ScrollingContentIndicator, ScrollingIndicatorParams } from 'components/ScrollingIndicator'
import { ScrollerContainer, Scroller, AnimatedDivContainer } from './styleds'

import { Lethargy } from 'lethargy'
interface ScrollingContentPageParams<D> {
  data: D[]
  dataItem: D | undefined
  IterableComponent: (props: D & ScrollableContentComponentBaseProps) => JSX.Element
}

export interface ScrollableContentComponentBaseProps {
  itemIndex: number
  isActive: boolean
  firstPaintOver?: boolean
}

type Params<P> = ScrollingContentPageParams<P> & Omit<ScrollingIndicatorParams, 'isLastIndex'>

const CONFIG = {
  SCROLL_SPEED_COEFFICIENT: 4,
  DRAG_SPEED_COEFFICIENT: 0.5
}
const MAC_SPRING_CONFIG: SpringConfig = { friction: 20, tension: 260 }
const WHEEL_SPRING_CONFIG: SpringConfig = { friction: 40, tension: 100 }
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
  s: false | -1 | 1
}

// initialise Lethary
const lethargy = new Lethargy()

export function useViewPagerAnimation({ items, visible = 1 }: any) {
  const prev = useRef([0, 1])
  const targetRef = useRef<HTMLDivElement | null>(null)

  const [currentIndex, setCurrentIndex] = useState(prev.current[0])
  const [target, setRef] = useState<HTMLDivElement>()
  const [height, setHeight] = useState<number>(0)

  const [firstPaintOver, setFirstPaintOver] = useState(false)

  // set container ref height to state
  // adjust clientHeight on window resize
  useEffect(() => {
    if (targetRef?.current && !target) {
      setRef(targetRef.current)
    }

    if (target && !height) {
      setHeight(target.clientHeight)
    }

    // resize handler - update clientHeight
    const _handleWindowResize = () => target?.clientHeight && setHeight(target.clientHeight)
    window.addEventListener('resize', _handleWindowResize)

    return () => {
      window.removeEventListener('resize', _handleWindowResize)
    }
  }, [height, target])

  const [springs, api] = useSprings(
    items.length,
    i => ({
      scale: 1,
      y: (i < items.length - 1 ? i : -1) * height,
      onRest: ({ value: { y } }) => {
        if (y === 0 && height > 0) {
          setCurrentIndex(i)
        }

        // useful in knowing when the FIRST animation has ended
        // like for setup
        if (!firstPaintOver) {
          setFirstPaintOver(true)
        }
      }
      // config: WHEEL_SPRING_CONFIG // MAC_SPRING_CONFIG
    }),
    [height]
  )

  const getIndex = useCallback((y, l = items.length) => (y < 0 ? y + l : y) % l, [items])
  const getPos = useCallback((i, firstVisible, firstVisibleIndex) => getIndex(i - firstVisible + firstVisibleIndex), [
    getIndex
  ])

  const calculateApiLogic = useCallback(
    ({ i, y, dy, my, active, firstVis, firstVisIdx, s }: ScrollSpringParams) => {
      const position = getPos(i, firstVis, firstVisIdx)
      const prevPosition = getPos(i, prev.current[0], prev.current[1])
      const rank = firstVis - (y < 0 ? items.length : 0) + position - firstVisIdx
      // const configPos = dy > 0 ? position : items.length - position
      const yPos = (-y % (height * items.length)) + height * rank
      const scale = active ? Math.max(1 - Math.abs(my) / height / 2, 0.8) : 1

      const anchorPoint = _getNearestAxisPoint(yPos, height)

      return {
        y: active ? yPos : anchorPoint,
        scale,
        immediate: dy < 0 ? prevPosition > position : prevPosition < position,
        // set configs based on intertial vs non-intertial scroll
        // s === false means intertial
        config: s === false ? MAC_SPRING_CONFIG : WHEEL_SPRING_CONFIG
      }
    },
    [getPos, height, items.length]
  )

  const runSprings = useCallback(
    (y, dy, my, active, s) => {
      const itemPosition = Math.floor(y / height) % items.length
      const firstVis = getIndex(itemPosition)
      const firstVisIdx = dy < 0 ? items.length - visible - 1 : 1

      api.start(i => calculateApiLogic({ i, y, dy, my, active, firstVis, firstVisIdx, s }))

      prev.current = [firstVis, firstVisIdx]
    },
    [height, items.length, getIndex, visible, api, calculateApiLogic]
  )

  const wheelOffset = useRef(0)
  const dragOffset = useRef(0)

  useGesture(
    {
      onDrag: ({ active, offset: [, y], movement: [, my], direction: [, dy] }) => {
        if (dy) {
          const aY = _getNearestAxisPoint(y, height)
          dragOffset.current = -aY ?? -y
          const computedY = wheelOffset.current + -y / CONFIG.DRAG_SPEED_COEFFICIENT
          runSprings(computedY, -dy, -my, active, false)
        }
      },
      onWheel: ({ event, active, offset: [, y], movement: [, my], direction: [, dy] }) => {
        event.preventDefault()

        // we need to check the scroll type... intertial vs linear
        // -1/1 = linear down/up scroll, respectively.
        // false = intertial
        const s = lethargy.check(event)

        if (dy) {
          const aY = _getNearestAxisPoint(y, height)
          wheelOffset.current = aY ?? y
          const computedY = dragOffset.current + y / CONFIG.SCROLL_SPEED_COEFFICIENT
          runSprings(computedY, dy, my, active, s)
        }
      }
    },
    {
      target,
      eventOptions: { passive: false }
    }
  )

  return {
    springs,
    target,
    targetRef,
    height,
    currentIndex,
    firstPaintOver
  }
}

export function ScrollingContentPage<D>({ data, dataItem, IterableComponent, ...indicatorProps }: Params<D>) {
  const { springs, targetRef, height, currentIndex, firstPaintOver } = useViewPagerAnimation({
    items: data,
    visible: 1
  })

  if (!dataItem) return null

  return (
    <>
      <FixedAnimatedLoader loadText="PASTELLE APPAREL" left="50%" animation />
      <ScrollerContainer>
        {/* scroll div */}
        <Scroller ref={targetRef} />
        {springs.map(({ y, scale }, i) => {
          return (
            <AnimatedDivContainer key={i} style={{ scale, height, y }}>
              <ScrollingContentIndicator {...indicatorProps} />
              <IterableComponent
                firstPaintOver={firstPaintOver}
                isActive={currentIndex === i}
                itemIndex={currentIndex}
                key={i}
                {...data[i]}
              />
            </AnimatedDivContainer>
          )
        })}
      </ScrollerContainer>
    </>
  )
}
