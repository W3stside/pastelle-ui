import { TouchAction } from 'components/ScrollingContentPage/styleds'
import { SmartImageProps } from 'components/SmartImg'
import { SpringAnimationHookReturn } from 'hooks/useScrollAnimation/useLimitedSwipe'
import { ForwardedRef } from 'react'

export interface BaseCarouselProps {
  data: any[]
  startIndex: number
  accentColor: string
  fixedSizes: { fixedWidth: number; fixedHeight: number } | undefined
  transformation?: SmartImageProps['transformation']
  fullSizeContent?: boolean
  parentNode?: HTMLElement
  onCarouselItemClick?: () => void
  children: ({ index, imageTransformations, isLast }: CarouselChildrenProps) => React.ReactNode
}

export interface BaseAnimatedCarouselProps extends BaseCarouselProps {
  animationProps: SpringAnimationHookReturn
  touchAction: TouchAction
}

export type WithTouchAction = {
  touchAction: TouchAction
}

export type CarouselChildrenProps = {
  index: number
  imageTransformations: SmartImageProps['transformation']
  isLast: boolean
  forwardedRef?: ForwardedRef<unknown>
}
