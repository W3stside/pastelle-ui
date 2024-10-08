import { useState, useEffect } from 'react'

/**
 * @description - sometimes necessary to force update/remount components
 */
export function useForceUpdate() {
  const [, setForceUpdate] = useState({})
  useEffect(() => {
    const timeout = setTimeout(() => setForceUpdate({}), 500)
    return () => {
      clearTimeout(timeout)
    }
  }, [])
}
