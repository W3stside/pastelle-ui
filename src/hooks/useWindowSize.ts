import { useEffect, useState } from 'react'

const isClient = typeof window === 'object'

function getSize() {
  return {
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined
  }
}

// https://usehooks.com/useWindowSize/
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    function handleCheckWindowSize() {
      setWindowSize(getSize())
    }

    // initial call
    handleCheckWindowSize()

    if (isClient) {
      window.addEventListener('resize', handleCheckWindowSize)
      return () => {
        window.removeEventListener('resize', handleCheckWindowSize)
      }
    }
    return undefined
  }, [])

  return windowSize
}
