import { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components/macro'
import { useGesture, useWheel } from '@use-gesture/react'
import { Lethargy } from 'lethargy'
import clamp from 'lodash.clamp'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import { ChevronUp, ChevronDown } from 'react-feather'
import { useSprings, a, config } from '@react-spring/web'
import { FixedAnimatedLoader } from 'components/Loader'
import useDebounce from 'hooks/useDebounce'

const lethargy = new Lethargy()

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

const ScrollerContainer = styled.div<{ index?: number; clientHeight?: number }>`
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

type ScrollingIndicatorParams = ScrollingIndicatorStyleProps & {
  baseContentMessage: string
  isLastIndex: boolean
}

interface ScrollingIndicatorStyleProps {
  bgColor?: string
  left?: string
  top?: string
  bottom?: string
  padding?: string
  height?: string
  width?: string
  zIndex?: number
}

const Wrapper = styled.div<ScrollingIndicatorStyleProps>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ bgColor = '#fa9b6f' }) => bgColor};
  color: ${({ color = '#000' }) => color};
  right: 0;
  ${({ left }) => left && `left: ${left};`}
  ${({ top }) => top && `top: ${top};`}
  ${({ bottom }) => bottom && `bottom: ${bottom};`}
  height: ${({ height = '50px' }) => height};
  width: ${({ width = '100%' }) => width};
  padding: ${({ padding = '0 10px' }) => padding};
  z-index: ${({ zIndex = 1 }) => zIndex};
`

export function ScrollingContentIndicator({
  baseContentMessage = 'MORE CONTENT',
  isLastIndex,
  ...styleProps
}: ScrollingIndicatorParams) {
  return (
    <Wrapper {...styleProps} top={isLastIndex ? '0px' : undefined} bottom={isLastIndex ? undefined : '0px'}>
      <ItemSubHeader>
        {baseContentMessage}
        {isLastIndex ? ' ABOVE' : ' BELOW'}
      </ItemSubHeader>
      {isLastIndex ? <ChevronUp /> : <ChevronDown />}
    </Wrapper>
  )
}

type Params<P> = ScrollingContentPageParams<P> & Omit<ScrollingIndicatorParams, 'isLastIndex'>

export function useWheelScrollAnimation(data: any[]) {
  const [index, setIndex] = useState(0)

  // ref to entire Catalog container
  const componentRef = useRef<HTMLDivElement | null>(null)
  const [ref, setRef] = useState<HTMLDivElement | undefined>()
  // set container ref to state
  useEffect(() => {
    setRef(componentRef?.current ?? undefined)
  }, [])

  const bind = useWheel(
    ({ event, last, memo: wait = false }) => {
      if (!last) {
        const s = lethargy.check(event)
        if (s) {
          if (!wait) {
            setIndex(i => clamp(i - s, 0, data.length - 1))
            return true
          }
          // TODO: check
          return false
        } else {
          return false
        }
      } else {
        return false
      }
    },
    {
      rubberband: 0.1
    }
  )

  return {
    index,
    ref,
    bind,
    componentRef
  }
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

export function useViewPagerAnimation({ items, visible = 0 }: any) {
  const prev = useRef([0, 1])
  const targetRef = useRef<HTMLDivElement | null>(null)
  const [target, setRef] = useState<HTMLDivElement>()
  const [height, setHeight] = useState<number>(0)

  // set container ref height to state
  useEffect(() => {
    if (targetRef?.current?.clientWidth) {
      setRef(targetRef.current ?? undefined)
    }

    target?.clientHeight && setHeight(target.clientHeight)
  }, [target?.clientHeight])

  const [currentIndex, setCurrentIndex] = useState(prev.current[0])
  const currentIndexDebounced = useDebounce(currentIndex, 400)

  const getIndex = useCallback((y, l = items.length) => (y < 0 ? y + l : y) % l, [items])
  const getPos = useCallback((i, firstVisible, firstVisibleIndex) => getIndex(i - firstVisible + firstVisibleIndex), [
    getIndex
  ])

  // const [nearestYAnchorPoint, setNearestYAnchorPoint] = useState(0)
  // const debouncedNYPoint = useDebounce(nearestYAnchorPoint, 100)

  const [springs, api] = useSprings(
    items.length,
    i => ({
      scale: 1,
      y: (i < items.length - 1 ? i : -1) * height
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
      setCurrentIndex(prev.current[0])
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
          runSprings(wheelOffset.current + -y, -dy, -my, active)
        }
      },
      onWheel: ({ event, active, offset: [, y], movement: [, my], direction: [, dy] }) => {
        event.preventDefault()
        if (dy) {
          const aY = _getNearestAxisPoint(y, height)
          wheelOffset.current = aY ?? y
          runSprings(dragOffset.current + y, dy, my, active)
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
    currentIndex: currentIndexDebounced
  }
}
const AnimatedDivContainer = styled(a.div)`
  position: absolute;
  width: 100%;
  will-change: transform;
`
export function ScrollingContentPage<D>({ data, dataItem, IterableComponent }: Params<D>) {
  const { springs, targetRef, height, currentIndex } = useViewPagerAnimation({ items: data, visible: 1 })

  if (!dataItem) return null

  return (
    <ArticleFadeInContainer>
      <FixedAnimatedLoader loadText="PASTELLE APPAREL" left="50%" animation />
      <ScrollerContainer>
        {/* scroll div */}
        {<Scroller ref={targetRef} />}
        {springs.map(({ y, scale }, i) => {
          return (
            <AnimatedDivContainer key={i} style={{ scale, height, y }}>
              <IterableComponent isActive={currentIndex === i} itemIndex={currentIndex} key={i} {...data[i]} />
            </AnimatedDivContainer>
          )
        })}
      </ScrollerContainer>
    </ArticleFadeInContainer>
  )
}
