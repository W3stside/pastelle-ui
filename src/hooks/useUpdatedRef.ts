import { MutableRefObject, useEffect, useRef, useState } from 'react'

export default function useUpdatedRef<R>({ refDefault }: { refDefault: R }) {
  const ref = useRef<R>(refDefault)
  const [refState, setRefState] = useState<MutableRefObject<R> | null>(null)

  useEffect(() => {
    if (Array.isArray(ref.current) ? ref.current?.length : ref.current) {
      setRefState(ref)
    }
  }, [])

  return { updatedRef: refState, refToSet: ref }
}
