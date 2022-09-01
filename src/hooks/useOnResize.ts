import { useEffect } from 'react'

export default function useOnResize(callback: (...params: any[]) => any, deps: any[]) {
  useEffect(() => {
    window.addEventListener('resize', callback)

    return () => {
      window.removeEventListener('resize', callback)
    }
  }, [callback, deps])
}
