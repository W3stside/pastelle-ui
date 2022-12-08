import { SpringRef } from 'react-spring'
import { InfiniteScrollHookOptions, InfiniteScrollSpringsState, InifniteScrollDataParams } from '../types'

/**
 *
 * @param a input
 * @param b constraint 1 (can be low or high)
 * @param c constraint 2 (can be low or high)
 * @returns number closer to b or c
 */
const _closerTo = (a: number, b: number, c: number) => (Math.abs(c - a) >= Math.abs(b - a) ? b : c)
function _getLimits(point: number, mult: number): number[] {
  const range = point / mult
  const highPoint = mult * Math.ceil(range)
  const bounds = [highPoint - mult, highPoint]

  return bounds
}
function _calcAnchorPos(point: number, mult: number) {
  const [limitA, limitB] = _getLimits(point, mult)

  return _closerTo(point, limitA, limitB)
}

export function getNearestAxisPoint(point: number, multiple: number) {
  const anchorPoint = _calcAnchorPos(point, multiple)

  return anchorPoint
}

export const getIndex = (axis: number, l: number) => (axis < 0 ? axis + l : axis) % l
export const getPos = (i: number, firstVisible: number, firstVisibleIndex: number, length: number) =>
  getIndex(i - firstVisible + firstVisibleIndex, length)

export const calculateInfiniteScrollApiLogic = (
  i: number,
  axisDirection: 'x' | 'y',
  {
    prevRef,
    active,
    last,
    axis,
    dAxis,
    mAxis,
    firstVis,
    firstVisIdx,
    scaleOptions,
    snapOnScroll,
    config,
    dataLength,
    itemSize,
    setCurrentIndex
  }: Omit<InfiniteScrollHookOptions, 'visible'> & InfiniteScrollSpringsState & InifniteScrollDataParams
) => {
  const position = getPos(i, firstVis, firstVisIdx, dataLength)
  const prevPosition = getPos(i, prevRef.current[0], prevRef.current[1], dataLength)
  const rank = firstVis - (axis < 0 ? dataLength : 0) + position - firstVisIdx
  // const configPos = dAxis > 0 ? position : dataLength - position

  const scale =
    mAxis && scaleOptions?.scaleOnScroll && active
      ? Math.max(1 - Math.abs(mAxis) / itemSize / 2, scaleOptions.scaleOnScroll)
      : scaleOptions.initialScale

  const axisPos = (-axis % (itemSize * dataLength)) + itemSize * rank
  const anchorPoint = last && getNearestAxisPoint(axisPos, itemSize)
  const onScreen = anchorPoint === 0

  // the frame at the 0 anchor point is the current one in frame
  // set it as the current index - sets header, nav, etc
  if (onScreen) {
    setCurrentIndex(i)
  }

  const configPos = dAxis > 0 ? position : dataLength - position
  const immediate = dAxis < 0 ? prevPosition > position : prevPosition < position

  return {
    [axisDirection]: !active && snapOnScroll ? anchorPoint : axisPos,
    scale,
    immediate,
    config: typeof config === 'function' ? config({ configPos, length: dataLength }) : config
  }
}
type RunSpringsParams = Omit<InfiniteScrollSpringsState, 'firstVis' | 'firstVisIdx'> &
  InfiniteScrollHookOptions &
  InifniteScrollDataParams
export function runInfiniteScrollSprings<T extends Record<any, any>>(
  api: SpringRef<T>,
  axisDirection: 'x' | 'y',
  { dataLength, itemSize, axis, dAxis, visible, prevRef, ...rest }: RunSpringsParams
) {
  const itemPosition = Math.floor(axis / itemSize) % dataLength
  const firstVis = getIndex(itemPosition, dataLength)
  const firstVisIdx = dAxis < 0 ? dataLength - visible - 1 : 1

  api.start(i =>
    calculateInfiniteScrollApiLogic(i, axisDirection, {
      axis,
      dAxis,
      firstVis,
      firstVisIdx,
      itemSize,
      dataLength,
      prevRef,
      ...rest
    })
  )

  prevRef.current = [firstVis, firstVisIdx]
}
