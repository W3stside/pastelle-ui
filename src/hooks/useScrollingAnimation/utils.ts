import { SpringRef } from 'react-spring'
import { AnimationHookParams, ScrollSpringParams } from './types'

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

export const calculateApiLogic = (
  itemsLength: number,
  itemSize: number,
  setCurrentIndex: (i: number) => void,
  {
    i,
    prevRef,
    active,
    axis,
    dAxis,
    mAxis,
    firstVis,
    firstVisIdx,
    scaleOptions,
    snapOnScroll,
    axisDirection,
    config
  }: Omit<ScrollSpringParams & AnimationHookParams, 'visible' | 'sizeOptions'>
) => {
  const position = getPos(i, firstVis, firstVisIdx, itemsLength)
  const prevPosition = getPos(i, prevRef.current[0], prevRef.current[1], itemsLength)
  const rank = firstVis - (axis < 0 ? itemsLength : 0) + position - firstVisIdx
  // const configPos = dAxis > 0 ? position : itemsLength - position

  const scale =
    mAxis && scaleOptions?.scaleOnScroll && active
      ? Math.max(1 - Math.abs(mAxis) / itemSize / 2, scaleOptions.scaleOnScroll)
      : scaleOptions.initialScale

  const axisPos = (-axis % (itemSize * itemsLength)) + itemSize * rank
  const anchorPoint = getNearestAxisPoint(axisPos, itemSize)
  const onScreen = anchorPoint === 0

  // the frame at the 0 anchor point is the current one in frame
  // set it as the current index - sets header, nav, etc
  if (onScreen) {
    setCurrentIndex(i)
  }

  const configPos = dAxis > 0 ? position : itemsLength - position
  const immediate = dAxis < 0 ? prevPosition > position : prevPosition < position

  return {
    [axisDirection]: !active && snapOnScroll ? anchorPoint : axisPos,
    scale,
    immediate,
    config: typeof config === 'function' ? config({ configPos, length: itemsLength }) : config
  }
}

export function runSprings<T extends Record<any, any>>(
  api: SpringRef<T>,
  dataLength: number,
  itemSize: number,
  setCurrentIndex: (i: number) => void,
  {
    axis,
    dAxis,
    prevRef,
    active,
    visible,
    axisDirection,
    snapOnScroll,
    scaleOptions,
    config
  }: Omit<ScrollSpringParams & AnimationHookParams, 'i' | 'visibile' | 'sizeOptions' | 'firstVis' | 'firstVisIdx'>
) {
  const itemPosition = Math.floor(axis / itemSize) % dataLength
  const firstVis = getIndex(itemPosition, dataLength)
  const firstVisIdx = dAxis < 0 ? dataLength - visible - 1 : 1

  api.start(i =>
    calculateApiLogic(dataLength, itemSize, setCurrentIndex, {
      i,
      axis,
      dAxis,
      active,
      firstVis,
      firstVisIdx,
      axisDirection,
      snapOnScroll,
      prevRef,
      scaleOptions,
      config
    })
  )

  prevRef.current = [firstVis, firstVisIdx]
}
