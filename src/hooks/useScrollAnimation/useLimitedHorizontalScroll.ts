import { useDrag } from '@use-gesture/react'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { useState } from 'react'
import { useSprings } from 'react-spring'
import clamp from 'lodash/clamp'
import useScrollZoneRefs from './utils/useScrollZoneRef'
interface Options {
  sensitivity: number
}
export default function useLimitedHorizontalScrollingAnimation(data: any[], options?: Options) {
  const {
    refs: { itemSize: width },
    refCallbacks
  } = useScrollZoneRefs('x', { minSize: STORE_IMAGE_SIZES.SMALL })
  const [currentIndex, setCurrentIndex] = useState(0)

  const [springs, api] = useSprings(data.length, i => ({
    x: i * width,
    display: 'block'
  }))

  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (active && Math.abs(mx) > width / (options?.sensitivity || 3)) {
      const clampedIndex = clamp(currentIndex + (xDir > 0 ? -1 : 1), 0, data.length - 1)
      setCurrentIndex(clampedIndex)
      cancel()
    }
    api.start(i => {
      if (i < currentIndex - 1 || i > currentIndex + 1) return { display: 'none' }
      const x = (i - currentIndex) * width + (active ? mx : 0) / 0.5
      return { x, display: 'block' }
    })
  })

  return {
    bind,
    springs,
    state: { currentIndex, width },
    refCallbacks
  }
}
