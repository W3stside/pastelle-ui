import { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components/macro'
import { useGesture } from '@use-gesture/react'
import clamp from 'lodash.clamp'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { useSprings, a, config } from '@react-spring/web'
import { FixedAnimatedLoader } from 'components/Loader'
import { ScrollingContentIndicator, ScrollingIndicatorParams } from 'components/ScrollingIndicator'

const Scroller = styled.div<{ index?: number; clientHeight?: number }>`
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  width: calc(100% - 500px);
  z-index: 900;

  touch-action: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`

const ScrollerContainer = styled.div`
  height: 100%;

  transition: transform 350ms ease-in-out;
`

interface ScrollingContentPageParams<D> {
  data: D[]
  dataItem: D | undefined
  IterableComponent: (props: D & ScrollableContentComponentBaseProps) => JSX.Element
}

export interface ScrollableContentComponentBaseProps {
  itemIndex: number
  isActive: boolean
}

type Params<P> = ScrollingContentPageParams<P> & Omit<ScrollingIndicatorParams, 'isLastIndex'>

const CONFIG = {
  SCROLL_SPEED_COEFFICIENT: 4,
  DRAG_SPEED_COEFFICIENT: 0.5
}
const SPRING_CONFIG = { ...config.stiff, tension: 260 }
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

export function useViewPagerAnimation({ items, visible = 1 }: any) {
  const prev = useRef([0, 1])
  const targetRef = useRef<HTMLDivElement | null>(null)
  const [target, setRef] = useState<HTMLDivElement>()
  const [height, setHeight] = useState<number>(0)

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

  const [currentIndex, setCurrentIndex] = useState(prev.current[0])

  const getIndex = useCallback((y, l = items.length) => (y < 0 ? y + l : y) % l, [items])
  const getPos = useCallback((i, firstVisible, firstVisibleIndex) => getIndex(i - firstVisible + firstVisibleIndex), [
    getIndex
  ])

  const [springs, api] = useSprings(
    items.length,
    i => ({
      scale: 1,
      y: (i < items.length - 1 ? i : -1) * height,
      onRest: ({ value: { y } }) => {
        if (y === 0 && height > 0) {
          setCurrentIndex(i)
        }
      }
    }),
    [height]
  )

  const calculateApiLogic = useCallback(
    ({ i, y, dy, my, active, firstVis, firstVisIdx }: ScrollSpringParams) => {
      const position = getPos(i, firstVis, firstVisIdx)
      const prevPosition = getPos(i, prev.current[0], prev.current[1])
      const rank = firstVis - (y < 0 ? items.length : 0) + position - firstVisIdx
      // const configPos = dy > 0 ? position : items.length - position
      const yPos = clamp((-y % (height * items.length)) + height * rank, -height, height)
      const scale = active ? Math.max(1 - Math.abs(my) / height / 2, 0.8) : 1

      const anchorPoint = _getNearestAxisPoint(yPos, height)

      return {
        y: active ? yPos : anchorPoint,
        scale,
        immediate: dy < 0 ? prevPosition > position : prevPosition < position,
        // config: { tension: (1 + items.length - configPos) * 600, friction: 30 + configPos * 40 }
        config: SPRING_CONFIG
      }
    },
    [getPos, height, items.length]
  )

  const runSprings = useCallback(
    (y, dy, my, active) => {
      const itemPosition = Math.floor(y / height) % items.length
      const firstVis = getIndex(itemPosition)
      const firstVisIdx = dy < 0 ? items.length - visible - 1 : 1

      api.start(i => calculateApiLogic({ i, y, dy, my, active, firstVis, firstVisIdx }))

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
          runSprings(computedY, -dy, -my, active)
        }
      },
      onWheel: ({ event, active, offset: [, y], movement: [, my], direction: [, dy] }) => {
        event.preventDefault()
        if (dy) {
          const aY = _getNearestAxisPoint(y, height)
          wheelOffset.current = aY ?? y
          const computedY = dragOffset.current + y / CONFIG.SCROLL_SPEED_COEFFICIENT
          runSprings(computedY, dy, my, active)
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
    currentIndex
  }
}
const AnimatedDivContainer = styled(a.div)`
  position: absolute;
  width: 100%;
  will-change: transform;
`
export function ScrollingContentPage<D>({ data, dataItem, IterableComponent, ...indicatorProps }: Params<D>) {
  const { springs, targetRef, height, currentIndex } = useViewPagerAnimation({ items: data, visible: 1 })

  if (!dataItem) return null

  return (
    <ArticleFadeInContainer>
      <FixedAnimatedLoader loadText="PASTELLE APPAREL" left="50%" animation />
      <ScrollerContainer>
        {/* scroll div */}
        <Scroller ref={targetRef} />
        {springs.map(({ y, scale }, i) => {
          return (
            <AnimatedDivContainer key={i} style={{ scale, height, y }}>
              <ScrollingContentIndicator {...indicatorProps} />
              <IterableComponent isActive={currentIndex === i} itemIndex={currentIndex} key={i} {...data[i]} />
            </AnimatedDivContainer>
          )
        })}
      </ScrollerContainer>
    </ArticleFadeInContainer>
  )
}
