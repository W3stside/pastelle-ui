import { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components/macro'
import { useGesture, useWheel } from '@use-gesture/react'
import { Lethargy } from 'lethargy'
import clamp from 'lodash.clamp'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import { ChevronUp, ChevronDown } from 'react-feather'
import { useSprings, a } from '@react-spring/web'
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
const SPRING_CONFIG = undefined // { tension: 600, friction: 300 }
export function useViewPagerAnimation({ items, visible = 0 }: any) {
  const prev = useRef([0, 1])
  const targetRef = useRef<HTMLDivElement | null>(null)
  const [target, setRef] = useState<HTMLDivElement>()
  const [height, setHeight] = useState<number>(0)
  const [currentIndex, setCurrentIndex] = useState(prev.current[0])

  const currentIndexDebounced = useDebounce(currentIndex, 400)

  const getIndex = useCallback((y, l = items.length) => (y < 0 ? y + l : y) % l, [items])
  const getPos = useCallback((i, firstVisible, firstVisibleIndex) => getIndex(i - firstVisible + firstVisibleIndex), [
    getIndex
  ])
  const [springs, api] = useSprings(items.length, i => ({ y: (i < items.length - 1 ? i : -1) * height }), [])
  // set container ref height to state
  useEffect(() => {
    if (targetRef?.current?.clientWidth) {
      setRef(targetRef.current ?? undefined)
      setHeight(targetRef.current.clientHeight)
    }
  }, [])

  const runSprings = useCallback(
    (y, dy) => {
      const firstVisible = getIndex(Math.floor(y / height) % items.length)
      const firstVisibleIndex = dy < 0 ? items.length - visible - 1 : 1

      api.start(i => {
        const position = getPos(i, firstVisible, firstVisibleIndex)
        const prevPosition = getPos(i, prev.current[0], prev.current[1])
        const rank = firstVisible - (y < 0 ? items.length : 0) + position - firstVisibleIndex
        const configPos = dy > 0 ? position : items.length - position
        const yAxis = (-y % (height * items.length)) + height * rank

        return {
          y: yAxis,
          immediate: dy < 0 ? prevPosition > position : prevPosition < position,
          // config: { tension: (1 + items.length - configPos) * 600, friction: 30 + configPos }
          config: SPRING_CONFIG || { tension: 600, friction: 30 + configPos * 80 }
        }
      })
      prev.current = [firstVisible, firstVisibleIndex]
      setCurrentIndex(prev.current[0])
    },
    [getIndex, height, items.length, visible, api, getPos]
  )

  const wheelOffset = useRef(0)
  const dragOffset = useRef(0)

  useGesture(
    {
      onDrag: ({ offset: [, y], direction: [, dy] }) => {
        if (dy) {
          dragOffset.current = -y
          runSprings(wheelOffset.current + -y, -dy)
        }
      },
      onWheel: ({ event, offset: [, y], direction: [, dy] }) => {
        event.preventDefault()
        if (dy) {
          wheelOffset.current = y
          runSprings(dragOffset.current + y, dy)
        }
      }
    },
    { target, eventOptions: { passive: false } }
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
      <FixedAnimatedLoader loadText="PASTELLE APPAREL" left="50%" />
      <ScrollerContainer>
        {/* scroll div */}
        {<Scroller ref={targetRef} />}
        {springs.map(({ y }, i) => {
          return (
            <AnimatedDivContainer key={i} style={{ height, y }}>
              <IterableComponent isActive={currentIndex === i} itemIndex={currentIndex} key={i} {...data[i]} />
            </AnimatedDivContainer>
          )
        })}
      </ScrollerContainer>
    </ArticleFadeInContainer>
  )
}
