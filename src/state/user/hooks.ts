import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/state'
import { useTheme } from 'styled-components/macro'
import { ThemeModes } from '@/theme'

import { UserState, updateShowcaseSettings, updateThemeAutoDetect, updateThemeMode } from './reducer'
import { initialState } from './reducer'

export const useAppColourTheme = () => useAppSelector(({ user }) => user.theme || initialState.theme)

export function useThemeManager() {
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const setAutoDetect = useCallback(
    (autoDetect: boolean) => {
      dispatch(updateThemeAutoDetect(autoDetect))
    },
    [dispatch]
  )

  const setMode = useCallback(
    (mode: ThemeModes) => {
      dispatch(updateThemeMode(mode))
      theme.setMode(mode)
    },
    [dispatch, theme]
  )

  return { ...theme, setMode, setAutoDetect }
}

type UpdateShowcaseSettingsParams = Partial<UserState['showcase']>
export function useUpdateShowcaseSettings() {
  const dispatch = useAppDispatch()
  return useCallback((params: UpdateShowcaseSettingsParams) => dispatch(updateShowcaseSettings(params)), [dispatch])
}

export function useGetShowcaseSettings() {
  return useAppSelector((state) => state.user.showcase)
}

export function useUpdateShowcaseVideoSettings(): [
  UserState['showcase']['videoSettings'],
  (settings: UserState['showcase']['videoSettings']) => void
] {
  const { videoSettings } = useAppSelector((state) => state.user.showcase)
  const updateShowcase = useUpdateShowcaseSettings()

  return [
    videoSettings,
    (settingsUpdate: UserState['showcase']['videoSettings']) => updateShowcase({ videoSettings: settingsUpdate }),
  ]
}
