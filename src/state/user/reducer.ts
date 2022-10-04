import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { Theme, ThemeModes } from 'theme/styled'

const currentTimestamp = () => new Date().getTime()

export type ShowcaseGender = 'MALE' | 'FEMALE'
export type ShowcaseHeight = 165 | 175 | 185 | 190
export interface UserState {
  theme: Theme
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number
  showcase: {
    gender: ShowcaseGender
    height: ShowcaseHeight
  }
}

export const initialState: UserState = {
  theme: {
    mode: ThemeModes.CHAMELEON,
    autoDetect: false
  },
  showcase: {
    gender: 'MALE',
    height: 175
  }
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateVersion(state) {
      state.lastUpdateVersionTimestamp = currentTimestamp()
    },
    updateThemeMode(state, action: PayloadAction<ThemeModes>) {
      state.theme.mode = action.payload
    },
    updateThemeAutoDetect(state, action: PayloadAction<boolean>) {
      state.theme.autoDetect = action.payload
    },
    updateShowcaseSettings(state, { payload }: PayloadAction<Partial<UserState['showcase']>>) {
      const { showcase: currentShowcase } = current(state)
      state.showcase = { ...currentShowcase, ...payload }
    }
  }
})
export const { updateThemeAutoDetect, updateThemeMode, updateShowcaseSettings } = userSlice.actions
export const user = userSlice.reducer
