import { SmartImageProps } from '@past3lle/components'
import { TouchAction } from 'components/ScrollingContentPage/styleds'
import { SpringAnimationHookReturn } from 'hooks/useScrollAnimation/useLimitedSwipe'
import { ForwardedRef } from 'react'

import { CarouselSetup } from './hooks'

export interface BaseCarouselProps {
  data: any[]
  startIndex: number
  accentColor: string
  fixedSizes: { width: number; height: number } | undefined
  transformation?: SmartImageProps['transformation']
  fullSizeContent?: boolean
  parentNode?: HTMLElement | null
  onCarouselItemClick?: () => void
  children: ({ index, defaultImageTransforms, isLast }: CarouselChildrenProps) => React.ReactNode
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
  isLast: boolean
  forwardedRef?: ForwardedRef<unknown>
  defaultImageTransforms: CarouselSetup['imageTransformations']
}
