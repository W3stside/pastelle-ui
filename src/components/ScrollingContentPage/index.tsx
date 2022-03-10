import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components/macro'
import { useWheel } from '@use-gesture/react'
import { Lethargy } from 'lethargy'
import clamp from 'lodash.clamp'
import { ArticleFadeInContainer } from 'components/Layout/Article'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import { ChevronUp, ChevronDown } from 'react-feather'

const lethargy = new Lethargy()

const Scroller = styled.div<{ index: number; clientHeight: number }>`
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  width: calc(100% - 500px);
  z-index: 900;

  transform: ${({ index, clientHeight }) => `translateY(${index * clientHeight}px)`};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`

const ScrollerContainer = styled.div<{ index: number; clientHeight: number }>`
  height: 100%;

  transform: ${({ index, clientHeight }) => `translateY(${-index * clientHeight}px)`};
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

export function ScrollingContentPage<D>({ data, dataItem, IterableComponent, ...scrollingIndicatorProps }: Params<D>) {
  const [index, setIndex] = useState(0)

  // ref to entire Catalog container
  const catalogRef = useRef<HTMLDivElement | null>(null)
  const [ref, setRef] = useState<HTMLDivElement | undefined>()
  // set container ref to state
  useEffect(() => {
    setRef(catalogRef?.current ?? undefined)
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
      rubberband: 0.3
    }
  )

  // if (!currentItem) return <Redirect to="/404" />
  if (!dataItem) return null

  const noContentOrSingular = data.length < 1
  const isLastIndex = data.length - 1 === index

  return (
    <ArticleFadeInContainer ref={catalogRef}>
      {!noContentOrSingular && <ScrollingContentIndicator isLastIndex={isLastIndex} {...scrollingIndicatorProps} />}
      {ref && (
        <ScrollerContainer index={index} clientHeight={ref.clientHeight}>
          {/* scroll div */}
          <Scroller index={index} clientHeight={ref.clientHeight} {...bind()} />
          {data.map((props, mapIndex) => {
            return <IterableComponent itemIndex={index} isActive={index === mapIndex} key={mapIndex} {...props} />
          })}
        </ScrollerContainer>
      )}
    </ArticleFadeInContainer>
  )
}
