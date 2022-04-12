import { useState, useRef, useEffect, useCallback, SetStateAction } from 'react'
import { useGesture } from '@use-gesture/react'
import { useSprings, SpringConfig } from '@react-spring/web'
import { FixedAnimatedLoader } from 'components/Loader'
import { ScrollingContentIndicator, ScrollingIndicatorParams } from 'components/ScrollingIndicator'
import { ScrollerContainer, Scroller, AnimatedDivContainer } from './styleds'

import { isMobile } from 'utils'
import PastelleIvoryOutlined from 'assets/svg/pastelle-ivory-outlined.svg'

interface ScrollingContentPageParams<D> {
  data: D[]
  dataItem: D | undefined
  fixedHeight?: number
  hideHeight?: number
  showIndicator?: boolean
  onContentClick?: React.MouseEventHandler<HTMLDivElement>
  IterableComponent: (props: D & ScrollableContentComponentBaseProps) => JSX.Element
}

export interface ScrollableContentComponentBaseProps {
  itemIndex: number
  isActive: boolean
  firstPaintOver?: boolean
}

type Params<P> = ScrollingContentPageParams<P> & Omit<ScrollingIndicatorParams, 'isLastIndex'>

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

const MINIMUM_CATALOG_ITEM_HEIGHT = 773

export function useViewPagerAnimation(
  items: any[],
  {
    visible = 1,
    // fixed height - bypasses useRef
    fixedHeight,
    // minimum height to render catalog
    minHeight = MINIMUM_CATALOG_ITEM_HEIGHT,
    // snap nearest screen after scroll end
    snapOnScroll = false,
    scaleOptions = {
      scaleOnScroll: 0.8,
      initialScale: 1
    }
  }: {
    scale?: number
    visible: number
    fixedHeight?: number
    minHeight?: number
    snapOnScroll?: boolean
    scaleOptions?: {
      scaleOnScroll?: number
      initialScale: number
    }
  }
) {
  const prev = useRef([0, 1])

  const [target, setContainerRef] = useStateRef(null, node => node)
  const [height, setHeightRef] = useStateRef<number>(
    0,
    node => fixedHeight || Math.min(node?.clientHeight, minHeight) || 0
  )

  // handle window resizing
  useEffect(() => {
    // resize handler - update clientHeight
    const _handleWindowResize = () => !fixedHeight && target?.clientHeight && setHeightRef(target)

    window?.addEventListener('resize', _handleWindowResize)
    // first run call
    _handleWindowResize()
    return () => {
      window?.removeEventListener('resize', _handleWindowResize)
    }
  }, [fixedHeight, setHeightRef, target])

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
      scale: scaleOptions.initialScale,
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
    ({ i, y, dy, my, active, firstVis, firstVisIdx }: ScrollSpringParams) => {
      const position = getPos(i, firstVis, firstVisIdx)
      const prevPosition = getPos(i, prev.current[0], prev.current[1])
      const rank = firstVis - (y < 0 ? items.length : 0) + position - firstVisIdx

      // const configPos = dy > 0 ? position : items.length - position
      const yPos = (-y % (height * items.length)) + height * rank
      const scale =
        scaleOptions?.scaleOnScroll && !isMobile && active
          ? Math.max(1 - Math.abs(my) / height / 2, scaleOptions.scaleOnScroll)
          : scaleOptions.initialScale

      const anchorPoint = _getNearestAxisPoint(yPos, height)

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
    [getPos, height, items.length, scaleOptions, snapOnScroll]
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

        // we need to check the scroll type... intertial vs linear
        // -1/1 = linear down/up scroll, respectively.
        // false = intertial

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
    setTargetRef,
    height,
    currentIndex,
    firstPaintOver
  }
}

export function ScrollingContentPage<D>({
  data,
  dataItem,
  fixedHeight,
  showIndicator = true,
  onContentClick,
  IterableComponent,
  ...indicatorProps
}: Params<D>) {
  const { springs, setTargetRef, height, currentIndex, firstPaintOver } = useViewPagerAnimation(data, {
    visible: 1,
    fixedHeight,
    snapOnScroll: false,
    // defaults to 0.8 scale on scroll and 1 scale default
    scaleOptions: {
      initialScale: 0.87
    }
  })

  if (!dataItem) return null

  return (
    <>
      <FixedAnimatedLoader loadText={<img src={PastelleIvoryOutlined} />} left="50%" animation width="40vw" />
      <ScrollerContainer>
        {/* scroll div */}
        <Scroller ref={setTargetRef} onClick={onContentClick && onContentClick} />
        {/* Were in mobile or the data passed only has 1 item, don't run loop animations */}
        {springs.map(({ y, scale }, i) => {
          return (
            <AnimatedDivContainer key={i} style={{ scale, height, y }}>
              {showIndicator && <ScrollingContentIndicator {...indicatorProps} />}
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
