import { LqImageOptions } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useGetWindowSize } from 'state/window/hooks'

import { BaseCarouselProps } from './types'

export interface CarouselSetup {
  parentWidth: number | undefined
  carouselContainer: HTMLElement | null
  imageTransformations: Omit<LqImageOptions, 'showLoadingIndicator'> & { pr: boolean }
  setCarouselContainerRef: (newNode: HTMLElement | null) => void
}
export function useCarouselSetup({ fixedSizes }: Pick<BaseCarouselProps, 'fixedSizes'>): CarouselSetup {
  const [parentWidth, setParentWidth] = useState<number | undefined>()

  // ref to carousel container
  const [carouselContainer, setCarouselContainerRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)

  // set carouselContainer states and focus carousel
  useEffect(() => {
    setParentWidth(carouselContainer?.parentElement?.offsetWidth)

    carouselContainer?.focus()
  }, [carouselContainer])

  // get a carouselContainer to the carouselboi
  // we need to hold and updated cache of the carousel parent's width in px
  const sizes = useGetWindowSize()
  // adjust refs on window size changes
  useEffect(() => {
    setParentWidth(carouselContainer?.parentElement?.offsetWidth)
  }, [carouselContainer?.parentElement?.offsetWidth, carouselContainer?.parentElement?.clientHeight, sizes])

  const imageTransformations = useMemo(
    () => ({
      width: _getTransformationsFromValue(fixedSizes?.width, carouselContainer?.clientWidth || 0),
      height: _getTransformationsFromValue(
        fixedSizes?.height,
        carouselContainer?.clientHeight || carouselContainer?.clientWidth || 0
      ),
      pr: true
    }),
    [fixedSizes, carouselContainer?.clientWidth, carouselContainer?.clientHeight]
  )

  return {
    parentWidth: fixedSizes?.width || parentWidth,
    carouselContainer,
    imageTransformations,
    setCarouselContainerRef
  }
}

function _getTransformationsFromValue(val: string | number | undefined, fallback: number) {
  if (!val || typeof val === 'string') {
    return fallback
  }

  return val
}
