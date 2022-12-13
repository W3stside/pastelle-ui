import useStateRef from 'hooks/useStateRef'
import { useState, useEffect, useMemo } from 'react'
import { useGetWindowSize } from 'state/window/hooks'
import { BaseCarouselProps } from './types'

export function useCarouselSetup({ fixedSizes }: Pick<BaseCarouselProps, 'fixedSizes'>) {
  const [parentWidth, setParentWidth] = useState<number | undefined>()

  // ref to carousel container
  const [carouselContainer, setCarouselContainerRef] = useStateRef<HTMLDivElement | null>(null, node => node)

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
    () => [
      {
        width: fixedSizes?.fixedWidth || carouselContainer?.clientWidth || 0,
        height: fixedSizes?.fixedHeight || carouselContainer?.clientHeight || carouselContainer?.clientWidth || 0,
        pr: true
      }
    ],
    [fixedSizes, carouselContainer?.clientWidth, carouselContainer?.clientHeight]
  )

  return {
    parentWidth: fixedSizes?.fixedWidth || parentWidth,
    carouselContainer,
    imageTransformations,
    setCarouselContainerRef
  }
}
