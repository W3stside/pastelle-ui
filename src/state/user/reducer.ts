import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Theme, ThemeModes } from 'theme/styled'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  theme: Theme
  // timestamp: number
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number
  // key string of current on screen item
  onScreenItemID: string | null
}

export const initialState: UserState = {
  theme: {
    mode: ThemeModes.CHAMELEON,
    autoDetect: false
  },
  // timestamp: currentTimestamp(),
  onScreenItemID: null
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
      // state.timestamp = currentTimestamp()
    },
    updateThemeAutoDetect(state, action: PayloadAction<boolean>) {
      state.theme.autoDetect = action.payload
      // state.timestamp = currentTimestamp()
    },
    setOnScreenItemID(state, action: PayloadAction<string | null>) {
      state.onScreenItemID = action.payload
      // state.timestamp = currentTimestamp()
    }
  }
})
export const { updateThemeAutoDetect, updateThemeMode, setOnScreenItemID } = userSlice.actions
export const user = userSlice.reducer
