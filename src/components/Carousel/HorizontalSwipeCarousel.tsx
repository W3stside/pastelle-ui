import { STORE_IMAGE_SIZES } from 'constants/config'
import { useLimitedHorizontalSwipe } from 'hooks/useScrollAnimation'
import AnimatedCarousel from './AnimatedCarousel'
import { BaseCarouselProps, WithTouchAction } from './types'

export default function HorizontalSwipeCarousel({
  data,
  fixedSizes,
  touchAction,
  ...rest
}: BaseCarouselProps & WithTouchAction) {
  const animationProps = useLimitedHorizontalSwipe(data, {
    sensitivity: 2,
    sizeOptions: { fixedSize: fixedSizes?.fixedWidth, minSize: STORE_IMAGE_SIZES.SMALL }
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
