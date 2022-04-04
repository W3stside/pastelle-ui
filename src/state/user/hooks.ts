import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from 'state'
import { Theme, ThemeModes } from 'theme/styled'
import { setOnScreenItemID, updateThemeAutoDetect, updateThemeMode } from './reducer'
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

export function useSetOnScreenItemID() {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback((params: string) => dispatch(setOnScreenItemID(params)), [dispatch])
}
export const useOnScreenItemID = () => useSelector<AppState, string | null>(({ user }) => user.onScreenItemID)
