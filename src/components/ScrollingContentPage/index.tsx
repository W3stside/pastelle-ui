import { StyledAnimatedDivContainer, StyledScrollerContainer, TouchAction } from '@past3lle/carousel'
import { useInfiniteVerticalScroll } from '@past3lle/carousel-hooks'
import { LoadInViewOptions, useIsSmallMediaWidth } from '@past3lle/hooks'
import { isMobile } from '@past3lle/utils'
import PastelleIvoryOutlined from 'assets/svg/pastelle-ivory-outlined.svg'
import { FixedAnimatedLoader } from 'components/Loader'
import { COLLECTION_MAX_WIDTH, MINIMUM_COLLECTION_ITEM_HEIGHT } from 'constants/config'
import { STIFF_SPRINGS } from 'constants/springs'
import { useCallback, useEffect, useMemo } from 'react'
import { Product } from 'shopify/graphql/types'

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
  dimensions?: {
    fixedSizes?: {
      fixedHeight?: number
      fixedWidth?: number
    }
  }
}

type Params<P> = ScrollingContentPageParams<P>

export function ScrollingContentPage<D>({
  data,
  dataItem,
  touchAction,
  fixedItemHeight,
  withBoxShadow = false,
  onContentClick,
  IterableComponent,
}: Params<D>) {
  const isMobileWidth = useIsSmallMediaWidth()
  const memoedSizeOptions = useMemo(
    () => ({
      // defaults to 0.8 scale on scroll and 1 scale default
      scaleOptions: {
        initialScale: isMobileWidth || isMobile ? 0.97 : 0.92,
      },
      scrollSpeed: isMobile ? 0.4 : undefined,
      sizeOptions: {
        fixedSize: fixedItemHeight,
        minSize: MINIMUM_COLLECTION_ITEM_HEIGHT,
      },
    }),
    [fixedItemHeight, isMobileWidth]
  )
  const {
    bind,
    springs,
    state: { itemSize: itemHeight, currentIndex, firstAnimationOver: firstPaintOver },
    refCallbacks: { setItemSizeRef: setHeightRef, setScrollingZoneRef },
  } = useInfiniteVerticalScroll(data, {
    visible: data.length <= 3 ? 1 : 2,
    snapOnScroll: false,
    config: STIFF_SPRINGS,
    ...memoedSizeOptions,
  })

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
      <StyledScrollerContainer $touchAction={touchAction} $isVerticalScroll {...bind()}>
        {springs.map(({ y, scale }, i, { length }) => {
          const product = data[i] as Product
          const isActive = currentIndex === i

          return (
            <StyledAnimatedDivContainer
              {...bind(i)}
              key={product.id}
              // z-index here is to set the next card under the stack
              style={{ scale, height: itemHeight, y, zIndex: length * 2 - i }}
              onClick={() => handleItemSelect(i)}
              // custom styled props
              $axis="y"
              $maxWidth={COLLECTION_MAX_WIDTH + 'px'}
              $touchAction={touchAction}
              $withBoxShadow={withBoxShadow}
            >
              <IterableComponent
                dimensions={{
                  fixedSizes: {
                    fixedHeight: fixedItemHeight,
                    fixedWidth: fixedItemHeight,
                  },
                }}
                loadInViewOptions={{
                  container: HEIGHT_AND_VIEW_TARGET || document,
                  conditionalCheck: firstPaintOver,
                }}
                // undefined = paint is over
                firstPaintOver={firstPaintOver !== false}
                isActive={isActive}
                itemIndex={i}
                key={product.id}
                {...data[i]}
              />
            </StyledAnimatedDivContainer>
          )
        })}
      </StyledScrollerContainer>
    </>
  )
}
