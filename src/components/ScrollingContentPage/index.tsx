import { Fragment, MouseEvent, useCallback, useEffect } from 'react'
import { FixedAnimatedLoader } from 'components/Loader'
import { ScrollingContentIndicator, ScrollingIndicatorParams } from 'components/ScrollingIndicator'
import { ScrollerContainer, AnimatedDivContainer, Scroller } from './styleds'

import PastelleIvoryOutlined from 'assets/svg/pastelle-ivory-outlined.svg'
import useScrollingPageAnimation from 'hooks/useScrollingPageAnimation'
import { LoadInView } from 'hooks/useDetectScrollIntoView'
import { COLLECTION_MAX_WIDTH } from 'constants/config'
import { isMobile } from 'utils'
import { Product } from 'shopify/graphql/types'

// TODO: bullshit
const HEADER_HEIGHT = 80
interface ScrollingContentPageParams<D> {
  data: D[]
  dataItem: D | undefined
  fixedHeight?: number
  hideHeight?: number
  showIndicator?: boolean
  useBoxShadow?: boolean
  onContentClick?: (handle?: string) => void // React.MouseEventHandler<HTMLDivElement>
  IterableComponent: (props: D & ScrollableContentComponentBaseProps) => JSX.Element
}

export interface ScrollableContentComponentBaseProps {
  itemIndex: number
  isActive: boolean
  firstPaintOver: boolean
  loadInView?: LoadInView
}

type Params<P> = ScrollingContentPageParams<P> & Omit<ScrollingIndicatorParams, 'isLastIndex'>

export function ScrollingContentPage<D>({
  data,
  dataItem,
  fixedHeight,
  showIndicator = true,
  useBoxShadow = false,
  onContentClick,
  IterableComponent,
  ...indicatorProps
}: Params<D>) {
  const {
    springs,
    api,
    setScrollingZoneRef,
    setHeightRef,
    height,
    currentIndex,
    restSet,
    target
  } = useScrollingPageAnimation(data, {
    visible: 2,
    fixedHeight,
    snapOnScroll: false,
    // defaults to 0.8 scale on scroll and 1 scale default
    scaleOptions: {
      initialScale: 0.92
      // scaleOnScroll: 0.55
    }
  })

  // set target ref node as collection article
  useEffect(() => {
    const heightTarget = document.getElementById('COLLECTION-ARTICLE')

    setHeightRef(heightTarget)
    !isMobile && setScrollingZoneRef(heightTarget)
  }, [setHeightRef, setScrollingZoneRef])

  const handleItemSelect = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!onContentClick) return
      const products = data as Product[]
      const halfHeight = height / 2
      const clickY = e.clientY - HEADER_HEIGHT - halfHeight
      const nextIdx = currentIndex < data.length - 1 ? currentIndex + 1 : 0
      const prevIdx = currentIndex === 0 ? data.length - 1 : currentIndex - 1
      const positions = {
        currItem: api.current[currentIndex].springs.y.get(),
        nextItem: api.current[nextIdx].springs.y.get(),
        prevItem: api.current[prevIdx].springs.y.get()
      }

      const clickedNext = positions.nextItem - halfHeight < clickY
      const clickedPrev =
        positions.prevItem + halfHeight - (target?.clientHeight ? target.clientHeight - height : height) / 2 > clickY

      return onContentClick(products[clickedNext ? nextIdx : clickedPrev ? prevIdx : currentIndex].handle)
    },
    [api, currentIndex, data, height, onContentClick, target]
  )

  if (!dataItem) return null

  return (
    <>
      <FixedAnimatedLoader loadText={<img src={PastelleIvoryOutlined} />} left="50%" animation={false} width="40vw" />
      {/* mobile only scrolling ref, using collection-article doesn't work on mobile */}
      {isMobile && <Scroller ref={setScrollingZoneRef} onClick={handleItemSelect} />}
      <ScrollerContainer>
        {springs.map(({ y, scale }, i) => {
          return (
            <AnimatedDivContainer
              key={y.id}
              style={{ scale, height, y }}
              $maxWidth={COLLECTION_MAX_WIDTH + 'px'}
              $useBoxShadow={useBoxShadow}
              onClick={isMobile ? undefined : () => onContentClick?.((data[i] as any).handle)}
            >
              {showIndicator && <ScrollingContentIndicator {...indicatorProps} />}
              <IterableComponent
                loadInView={{
                  container: document,
                  conditionalCheck: restSet.size === data.length
                }}
                firstPaintOver={restSet.size === data.length}
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
