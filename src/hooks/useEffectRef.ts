import { useState, RefObject, useRef, useEffect } from 'react'

export default function useEffectRef<T>(defaultRefValue: any) {
  const [refToObserve, setRefToObserve] = useState<RefObject<T>>()
  const refToSet = useRef<T>(defaultRefValue)
  useEffect(() => {
    setRefToObserve(refToSet)
  }, [])

  return [refToSet, refToObserve]
}
