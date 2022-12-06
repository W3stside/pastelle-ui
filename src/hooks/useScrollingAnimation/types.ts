import { MutableRefObject } from 'react'
import { SpringConfig } from 'react-spring'

export interface AnimationHookParams {
  axisDirection: 'x' | 'y'
  scale?: number
  visible: number
  scrollSpeed?: number
  snapOnScroll?: boolean
  dynamicConfig?: boolean
  // size options
  sizeOptions: {
    fixedSize?: number
    minSize: number
  }
  scaleOptions: {
    scaleOnScroll?: number
    initialScale: number
  }
  config?: SpringConfig | ((options: { configPos: number; length: number }) => SpringConfig)
}

export interface ScrollSpringParams {
  i: number
  axis: number
  dAxis: number
  mAxis?: number
  active: boolean
  firstVis: number
  firstVisIdx: number
  prevRef: MutableRefObject<number[]>
}
