import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from 'state'
import { Theme, ThemeModes } from 'theme/styled'
import {
  CatalogCurrentProduct,
  setOnScreenProductHandle,
  updateThemeAutoDetect,
  updateThemeMode,
  updateWindowSize,
  WindowSize
} from './reducer'
import { initialState } from './reducer'

export const useAppColourTheme = () => useSelector<AppState, Theme>(({ user }) => user.theme || initialState.theme)

interface ThemeManager {
  theme: Theme
  setMode: (mode: ThemeModes) => void
  setAutoDetect: (autoDetect: boolean) => void
}

export function useThemeManager(): ThemeManager {
  const dispatch = useDispatch<AppDispatch>()
  const theme = useAppColourTheme()

  const setMode = useCallback(
    (mode: ThemeModes) => {
      dispatch(updateThemeMode(mode))
    },
    [dispatch]
  )

  const setAutoDetect = useCallback(
    (autoDetect: boolean) => {
      dispatch(updateThemeAutoDetect(autoDetect))
    },
    [dispatch]
  )

  return { theme, setMode, setAutoDetect }
}

export function useSetOnScreenProductHandle() {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback((params: CatalogCurrentProduct) => dispatch(setOnScreenProductHandle(params)), [dispatch])
}

export const useOnScreenProductHandle = () =>
  useSelector<AppState, CatalogCurrentProduct | null>(({ user }) => user.catalogCurrentProduct)

export function useUpdateWindowSize() {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback((params: WindowSize) => dispatch(updateWindowSize(params)), [dispatch])
}

export const useGetWindowSize = () => useSelector<AppState, WindowSize>(({ user }) => user.windowSize)
