import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from 'state'
import { Theme, ThemeModes } from 'theme/styled'
import { updateShowcaseSettings, updateThemeAutoDetect, updateThemeMode, UserState } from './reducer'
import { initialState } from './reducer'

export const useAppColourTheme = () => useAppSelector(({ user }) => user.theme || initialState.theme)

interface ThemeManager {
  theme: Theme
  setMode: (mode: ThemeModes) => void
  setAutoDetect: (autoDetect: boolean) => void
}

export function useThemeManager(): ThemeManager {
  const dispatch = useAppDispatch()
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

type UpdateShowcaseSettingsParams = Partial<UserState['showcase']>
export function useUpdateShowcaseSettings() {
  const dispatch = useAppDispatch()
  return useCallback((params: UpdateShowcaseSettingsParams) => dispatch(updateShowcaseSettings(params)), [dispatch])
}

export function useGetShowcaseSettings() {
  return useAppSelector(state => state.user.showcase)
}

export function useUpdateAutoplaySettings(): [boolean, (autoplay: boolean) => void] {
  const { autoplay } = useAppSelector(state => state.user.showcase)
  const updateShowcase = useUpdateShowcaseSettings()

  return [autoplay, (autoplay: boolean) => updateShowcase({ autoplay })]
}
