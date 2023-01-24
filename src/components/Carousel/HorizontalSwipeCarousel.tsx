import { STORE_IMAGE_SIZES } from 'constants/config'
import { useLimitedHorizontalSwipe } from 'hooks/useScrollAnimation'

import AnimatedCarousel from './common/components/AnimatedCarousel'
import { BaseCarouselProps, WithTouchAction } from './common/types'

export default function HorizontalSwipeCarousel({
  data,
  fixedSizes,
  touchAction,
  ...rest
}: BaseCarouselProps & WithTouchAction) {
  const animationProps = useLimitedHorizontalSwipe(data, {
    sizeOptions: { fixedSize: fixedSizes?.width, minSize: STORE_IMAGE_SIZES.SMALL }
  })

  return (
    <AnimatedCarousel
      {...rest}
      touchAction={touchAction}
      fixedSizes={fixedSizes}
      data={data}
      animationProps={animationProps}
    />
  )
}
