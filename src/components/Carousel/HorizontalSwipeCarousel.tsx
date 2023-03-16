import { STORE_IMAGE_SIZES } from 'constants/config'
import { useLimitedHorizontalSwipe } from 'hooks/useScrollAnimation'

import AnimatedCarousel from './common/components/AnimatedCarousel'
import { BaseCarouselProps, WithTouchAction } from './common/types'

export default function HorizontalSwipeCarousel<D extends any[]>({
  data,
  dimensions,
  touchAction,
  ...rest
}: BaseCarouselProps<D> & WithTouchAction) {
  const animationProps = useLimitedHorizontalSwipe(data, {
    sizeOptions: { fixedSize: dimensions?.fixedSizes?.width, minSize: STORE_IMAGE_SIZES.SMALL },
  })

  return (
    <AnimatedCarousel
      {...rest}
      data={data}
      dimensions={dimensions}
      animationProps={animationProps}
      touchAction={touchAction}
    />
  )
}
