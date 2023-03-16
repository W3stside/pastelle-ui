import { SmartImageProps } from '@past3lle/components'
import { TouchAction } from 'components/ScrollingContentPage/styleds'
import { AxisDirection } from 'hooks/useScrollAnimation'
import { SpringAnimationHookReturn } from 'hooks/useScrollAnimation/useLimitedSwipe'
import { ForwardedRef } from 'react'

import { CarouselSetup } from './hooks'

export interface BaseCarouselPropsLegacy {
  data: any[]
  axis: AxisDirection
  startIndex: number
  accentColor: string
  fixedSizes: { width: number; height: number } | undefined
  transformation?: SmartImageProps['transformation']
  parentNode?: HTMLElement | null
  onCarouselItemClick?: () => void
  children: ({ index, defaultImageTransforms, isLast }: CarouselChildrenProps) => React.ReactNode
}

export interface OptionalCarouselProps {
  parentNode?: HTMLElement | null
  onCarouselItemClick?: () => void
  colors?: {
    accent?: string
    background?: string
  }
  dimensions?: {
    fixedSizes?: { width: number; height: number } | undefined
    fillContainer?: boolean
    fullSizeContent?: boolean
  }
  imageKit?: {
    transformation?: SmartImageProps['transformation']
  }
}
export interface BaseCarouselProps<T extends any[]> extends OptionalCarouselProps {
  data: T
  axis: AxisDirection
  startIndex: number
  children: ({ index, defaultImageTransforms, isLast }: CarouselChildrenProps) => React.ReactNode
}

export type WithTouchAction = {
  touchAction: TouchAction
}

export interface BaseAnimatedCarouselProps<T extends any[]> extends BaseCarouselProps<T>, WithTouchAction {
  animationProps: SpringAnimationHookReturn
}

export interface BaseAnimatedCarouselPropsLegacy extends BaseCarouselPropsLegacy, WithTouchAction {
  animationProps: SpringAnimationHookReturn
}

export type CarouselChildrenProps = {
  index: number
  isLast: boolean
  forwardedRef?: ForwardedRef<unknown>
  defaultImageTransforms: CarouselSetup['imageTransformations']
}
