import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Theme, ThemeModes } from 'theme/styled'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  theme: Theme
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number
}

export const initialState: UserState = {
  theme: {
    mode: ThemeModes.CHAMELEON,
    autoDetect: false
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
    }
  }
})
export const { updateThemeAutoDetect, updateThemeMode } = userSlice.actions
export const user = userSlice.reducer
