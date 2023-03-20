import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { WindowSize, updateWindowSize } from 'state/window/reducer'

export function useUpdateWindowSize() {
  const dispatch = useAppDispatch()

  return useCallback((params: WindowSize) => dispatch(updateWindowSize(params)), [dispatch])
}

export const useGetWindowSize = () => useAppSelector(({ window }) => window.sizes)
