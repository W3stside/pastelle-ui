import { useEffect } from 'react'
import useDebounce from 'hooks/useDebounce'
import { useWindowSize } from 'hooks/useWindowSize'
import { useUpdateWindowSize } from 'state/window/hooks'
import { WindowSize } from 'state/window/reducer'

const WINDOW_SIZE_UPDATE_DEBOUNCE_TIME = 500
export default function Updater(): null {
  const data = useWindowSize()
  const updateWindowSize = useUpdateWindowSize()
  const debouncedData = useDebounce<WindowSize>(data, WINDOW_SIZE_UPDATE_DEBOUNCE_TIME)

  useEffect(() => {
    updateWindowSize(debouncedData)
  }, [debouncedData, updateWindowSize])

  return null
}
