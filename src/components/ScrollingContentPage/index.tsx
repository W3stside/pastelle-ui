import { useCallback, useEffect } from 'react'
import { FixedAnimatedLoader } from 'components/Loader'
import { ScrollerContainer, AnimatedDivContainer, TouchAction } from './styleds'

import PastelleIvoryOutlined from 'assets/svg/pastelle-ivory-outlined.svg'
import { useInfiniteVerticalScroll } from 'hooks/useScrollAnimation'
import { LoadInViewOptions } from 'hooks/useDetectScrollIntoView'
import { COLLECTION_MAX_WIDTH, MINIMUM_COLLECTION_ITEM_HEIGHT } from 'constants/config'
import { isMobile } from 'utils'
import { Product } from 'shopify/graphql/types'
import { STIFF_SPRINGS } from 'constants/springs'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'

interface ScrollingContentPageParams<D> {
  data: D[]
  dataItem: D | undefined
  fixedItemHeight?: number
  hideHeight?: number
  showIndicator?: boolean
  withBoxShadow?: boolean
  touchAction: TouchAction
  onContentClick?: (handle?: string) => void // React.MouseEventHandler<HTMLDivElement>
  IterableComponent: (props: D & ScrollableContentComponentBaseProps) => JSX.Element
}

export interface ScrollableContentComponentBaseProps {
  itemIndex: number
  isActive: boolean
  firstPaintOver: boolean
  loadInViewOptions?: LoadInViewOptions
}

type Params<P> = ScrollingContentPageParams<P>

export function ScrollingContentPage<D>({
  data,
  dataItem,
  fixedItemHeight,
  withBoxShadow = false,
  touchAction,
  onContentClick,
  IterableComponent
}: Params<D>) {
  const isMobileWidth = useIsMobileWindowWidthSize()
  const {
    bind,
    springs,
    itemSize: itemHeight,
    currentIndex,
    firstPaintOver,
    setItemSizeRef: setHeightRef,
    setScrollingZoneRef
  } = useInfiniteVerticalScroll(
    data,
    {
      visible: 2,
      snapOnScroll: false,
      // defaults to 0.8 scale on scroll and 1 scale default
      scaleOptions: {
        initialScale: isMobileWidth || isMobile ? 0.97 : 0.92
      },
      scrollSpeed: isMobile ? 0.4 : undefined,
      config: STIFF_SPRINGS
    },
    { fixedSize: fixedItemHeight, minSize: MINIMUM_COLLECTION_ITEM_HEIGHT }
  )

  /**
   * Reference ELEM for which we:
   *
   * Set the target HEIGHT ref (sets the heights of scrolling article divs accordingly)
   * Set as the "loadInViewOptions" boundary - that is when elems scroll into it's view they are loaded
   */
  const HEIGHT_AND_VIEW_TARGET = document.getElementById('COLLECTION-ARTICLE')

  // set target ref node as collection article
  useEffect(() => {
    setHeightRef(HEIGHT_AND_VIEW_TARGET)
    !isMobile && setScrollingZoneRef(HEIGHT_AND_VIEW_TARGET)
  }, [HEIGHT_AND_VIEW_TARGET, setHeightRef, setScrollingZoneRef])

  const handleItemSelect = useCallback(
    (index: number) => onContentClick && onContentClick((data[index] as Product).handle),
    [data, onContentClick]
  )

  if (!dataItem) return null

  return (
    <>
      <FixedAnimatedLoader
        showBg={false}
        loadingComponent={<img src={PastelleIvoryOutlined} />}
        left="50%"
        width="40vw"
      />
      <ScrollerContainer $touchAction={touchAction} $isVerticalScroll {...bind()}>
        {springs.map(({ y, scale }, i, { length }) => {
          return (
            <AnimatedDivContainer
              {...bind(i)}
              key={i}
              $touchAction={touchAction}
              // z-index here is to set the next card under the stack
              style={{ scale, height: itemHeight, y, zIndex: length * 2 - i }}
              $maxWidth={COLLECTION_MAX_WIDTH + 'px'}
              $withBoxShadow={withBoxShadow}
              onClick={() => handleItemSelect(i)}
              $isVerticalScroll
            >
              <IterableComponent
                loadInViewOptions={{
                  container: HEIGHT_AND_VIEW_TARGET || document,
                  conditionalCheck: firstPaintOver
                }}
                firstPaintOver={firstPaintOver}
                isActive={currentIndex === i}
                itemIndex={i}
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
