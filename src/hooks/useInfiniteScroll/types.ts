import { MutableRefObject } from 'react'
import { SpringConfig } from 'react-spring'

export type SizeOptions = {
  fixedSize?: number
  minSize: number
}

export interface InifniteScrollDataParams {
  itemSize: number
  dataLength: number
  setCurrentIndex: (i: number) => void
}

export interface InfiniteScrollHookOptions {
  scale?: number
  visible: number
  scrollSpeed?: number
  snapOnScroll?: boolean
  dynamicConfig?: boolean
  scaleOptions: {
    scaleOnScroll?: number
    initialScale: number
  }
  config?: SpringConfig | ((options: { configPos: number; length: number }) => SpringConfig)
}

export interface InfiniteScrollSpringsState {
  axis: number
  dAxis: number
  mAxis?: number
  active: boolean
  firstVis: number
  firstVisIdx: number
  prevRef: MutableRefObject<number[]>
}
