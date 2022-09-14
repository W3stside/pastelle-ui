import { useState, useRef, useEffect } from 'react'
import { useWheel } from '@use-gesture/react'
import clamp from 'lodash.clamp'
import { Lethargy } from 'lethargy'

const lethargy = new Lethargy()

export function useWheelScrollAnimation(data: any[]) {
  const [index, setIndex] = useState(0)

  // ref to entire Collection container
  const componentRef = useRef<HTMLDivElement | null>(null)
  const [ref, setRef] = useState<HTMLDivElement | undefined>()
  // set container ref to state
  useEffect(() => {
    setRef(componentRef?.current ?? undefined)
  }, [])

  const bind = useWheel(
    ({ event, last, memo: wait = false }) => {
      if (!last) {
        const s = lethargy.check(event)
        if (s) {
          if (!wait) {
            setIndex(i => clamp(i - s, 0, data.length - 1))
            return true
          }
          // TODO: check
          return false
        } else {
          return false
        }
      } else {
        return false
      }
    },
    {
      rubberband: 0.1
    }
  )

  return {
    index,
    ref,
    bind,
    componentRef
  }
}
