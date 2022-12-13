import { useDrag } from '@use-gesture/react'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { useRef, useState } from 'react'
import { useSprings } from 'react-spring'
import useScrollZoneRefs from './utils/useScrollZoneRef'
import { SizeOptions } from './types'
import utils from './utils/utils'
interface Options {
  sensitivity: number
  sizeOptions?: SizeOptions
}

export function useLimitedHorizontalSwipe(data: any[], options?: Options) {
  const {
    refs: { itemSize: width },
    refCallbacks
  } = useScrollZoneRefs('x', options?.sizeOptions || { minSize: STORE_IMAGE_SIZES.SMALL })

  const indexRef = useRef(0)
  const [indexState, setIndexState] = useState(indexRef.current)

  const [springs, api] = useSprings(
    data.length,
    i => ({
      x: i * width,
      display: 'block'
    }),
    [width]
  )

  const bind = useDrag(
    utils.drag.limited([, api], {
      axis: 'x',
      indexOptions: { current: indexRef, setIndex: setIndexState, last: data.length - 1 },
      itemSize: width
    }),
    { axis: 'x' }
  )

  return {
    bind,
    springs,
    state: { currentIndex: indexState, width },
    refCallbacks
  }
}

export function useLimitedVerticalSwipe(data: any[], options?: Options) {
  const {
    refs: { itemSize: height },
    refCallbacks
  } = useScrollZoneRefs('y', options?.sizeOptions || { minSize: STORE_IMAGE_SIZES.SMALL })

  const indexRef = useRef(0)
  const [indexState, setIndexState] = useState(indexRef.current)

  const [springs, api] = useSprings(
    data.length,
    i => ({
      y: i * height,
      display: 'block'
    }),
    [height]
  )

  const bind = useDrag(
    utils.drag.limited([, api], {
      axis: 'y',
      indexOptions: { current: indexRef, setIndex: setIndexState, last: data.length - 1 },
      itemSize: height
    }),
    { axis: 'y' }
  )

  return {
    bind,
    springs,
    state: { currentIndex: indexState, height },
    refCallbacks
  }
}
