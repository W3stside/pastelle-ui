import useDebounce from 'hooks/useDebounce'
import { useWindowSize } from 'hooks/useWindowSize'
import { useEffect } from 'react'
import { useUpdateWindowSize } from './hooks'
import { WindowSize } from './reducer'

export default function Updater(): null {
  const data = useWindowSize()
  const updateWindowSize = useUpdateWindowSize()
  const debouncedData = useDebounce<WindowSize>(data, 300)

  useEffect(() => {
    updateWindowSize(debouncedData)
  }, [debouncedData, updateWindowSize])

  return null
}
