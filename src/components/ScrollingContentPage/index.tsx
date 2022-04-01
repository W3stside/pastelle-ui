import { useState, useRef, useEffect, useCallback, SetStateAction } from 'react'
import { useGesture } from '@use-gesture/react'
import { useSprings, SpringConfig } from '@react-spring/web'
import { FixedAnimatedLoader } from 'components/Loader'
import { ScrollingContentIndicator, ScrollingIndicatorParams } from 'components/ScrollingIndicator'
import { ScrollerContainer, Scroller, AnimatedDivContainer } from './styleds'

import { Lethargy } from 'lethargy'
import { isMobile } from 'utils'
import PastelleIvoryOutlined from 'assets/svg/pastelle-ivory-outlined.svg'

interface ScrollingContentPageParams<D> {
  data: D[]
  dataItem: D | undefined
  fHeight?: number
  hideHeight?: number
  showIndicator?: boolean
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
// const WHEEL_SPRING_CONFIG: SpringConfig = { friction: 40, tension: 100 }
const MOBILE_SPRING_CONFIG: SpringConfig = { friction: 20, tension: 50 }
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

function useStateRef<T>(defaultRef: T, processNode: (node: any) => SetStateAction<T>): [T, (newNode: any) => void] {
  const [node, setNode] = useState<T>(defaultRef)
  const setRef = useCallback(
    newNode => {
      setNode(processNode(newNode))
    },
    [processNode]
  )
  return [node, setRef]
}

export function useViewPagerAnimation({
  items,
  visible = 1,
  fHeight
}: // hideHeight
{
  items: any[]
  visible: number
  fHeight?: number
  hideHeight?: number
}) {
  const prev = useRef([0, 1])

  const [target, setContainerRef] = useStateRef(null, node => node)
  const [height, setHeightRef] = useStateRef<number>(0, node => fHeight || node?.clientHeight || 0)

  // handle window resizing
  useEffect(() => {
    // resize handler - update clientHeight
    const _handleWindowResize = () => !fHeight && target?.clientHeight && setHeightRef(target)
    window?.addEventListener('resize', _handleWindowResize)

    return () => {
      window?.removeEventListener('resize', _handleWindowResize)
    }
  }, [fHeight, setHeightRef, target])

  const setTargetRef = useCallback((node: any) => {
    setContainerRef(node)
    setHeightRef(node)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [currentIndex, setCurrentIndex] = useState(prev.current[0])
  const [firstPaintOver, setFirstPaintOver] = useState(false)

  const [springs, api] = useSprings(
    items.length,
    i => ({
      scale: 1,
      y: (i < items.length - 1 ? i : -1) * height,
      onRest: () => {
        // if (y === 0 && height > 0) {
        //   setCurrentIndex(i)
        // }

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
      const scale = !isMobile && active ? Math.max(1 - Math.abs(my) / height / 2, 0.8) : 1

      const anchorPoint = _getNearestAxisPoint(yPos, height)

      anchorPoint === 0 && setCurrentIndex(i)

      return {
        y: active ? yPos : anchorPoint,
        scale,
        immediate: dy < 0 ? prevPosition > position : prevPosition < position,
        // set configs based on intertial vs non-intertial scroll
        // s === false means intertial
        config: isMobile ? MOBILE_SPRING_CONFIG : s === false ? MAC_SPRING_CONFIG : MAC_SPRING_CONFIG // WHEEL_SPRING_CONFIG
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
    setTargetRef,
    height,
    currentIndex,
    firstPaintOver
  }
}

export function ScrollingContentPage<D>({
  data,
  dataItem,
  fHeight,
  // hideHeight,
  showIndicator = true,
  IterableComponent,
  ...indicatorProps
}: Params<D>) {
  const [mobileView, setMobileView] = useState(false)
  const { springs, setTargetRef, height, currentIndex, firstPaintOver } = useViewPagerAnimation({
    items: data,
    visible: 1,
    fHeight,
    hideHeight: fHeight ? fHeight * 2 : undefined
  })

  if (!dataItem) return null

  const mobileProps = isMobile ? { mobileView: true, handleMobileViewClick: () => setMobileView(state => !state) } : {}

  return (
    <>
      <FixedAnimatedLoader loadText={<img src={PastelleIvoryOutlined} />} left="50%" animation width="40vw" />
      <ScrollerContainer>
        {/* scroll div */}
        {!mobileView && (
          <Scroller ref={setTargetRef} onClick={mobileProps.mobileView && (mobileProps.handleMobileViewClick as any)} />
        )}
        {mobileView ? (
          <IterableComponent
            firstPaintOver={firstPaintOver}
            isActive={true}
            itemIndex={currentIndex}
            {...data[currentIndex]}
          />
        ) : (
          springs.map(({ y, scale }, i) => {
            return (
              <AnimatedDivContainer key={i} style={{ scale, height, y }}>
                {showIndicator && <ScrollingContentIndicator {...indicatorProps} />}
                <IterableComponent
                  firstPaintOver={firstPaintOver}
                  isActive={currentIndex === i}
                  itemIndex={currentIndex}
                  key={i}
                  {...mobileProps}
                  {...data[i]}
                />
              </AnimatedDivContainer>
            )
          })
        )}
      </ScrollerContainer>
    </>
  )
}
