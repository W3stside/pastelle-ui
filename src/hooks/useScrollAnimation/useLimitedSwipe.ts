import { useDrag } from '@use-gesture/react'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { useState } from 'react'
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

  const [currentIndex, setIndex] = useState(0)

  const [springs, api] = useSprings(data.length, i => ({
    x: i * width,
    display: 'block'
  }))

  const bind = useDrag(
    utils.drag.limited([, api], {
      direction: 'x',
      indexOptions: { setIndex, current: currentIndex, last: data.length - 1 },
      itemSize: width
    })
  )

  return {
    bind,
    springs,
    state: { currentIndex, width },
    refCallbacks
  }
}

export function useLimitedVerticalSwipe(data: any[], options?: Options) {
  const {
    refs: { itemSize: height },
    refCallbacks
  } = useScrollZoneRefs('y', options?.sizeOptions || { minSize: STORE_IMAGE_SIZES.SMALL })

  const [currentIndex, setIndex] = useState(0)

  const [springs, api] = useSprings(data.length, i => ({
    y: i * height,
    display: 'block'
  }))

  const bind = useDrag(
    utils.drag.limited([, api], {
      direction: 'y',
      indexOptions: { setIndex, current: currentIndex, last: data.length - 1 },
      itemSize: height
    })
  )

  return {
    bind,
    springs,
    state: { currentIndex, height },
    refCallbacks
  }
}
