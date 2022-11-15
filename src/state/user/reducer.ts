import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { ProductSizes } from 'shopify/graphql/types'
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
    size: ProductSizes
  }
}

export const initialState: UserState = {
  theme: {
    mode: ThemeModes.LIGHT,
    autoDetect: false
  },
  showcase: {
    gender: 'MALE',
    height: 175,
    size: ProductSizes.L
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

      // proper state type check
      if (_isShowcaseState(currentShowcase)) {
        const newState = { ...currentShowcase, ...payload }
        state.showcase = newState
      } else {
        state.showcase = initialState.showcase
      }
    }
  }
})
export const { updateThemeAutoDetect, updateThemeMode, updateShowcaseSettings } = userSlice.actions
export const user = userSlice.reducer

function _isShowcaseState(showcase: UserState['showcase']) {
  return (
    (showcase?.gender === 'MALE' || showcase?.gender === 'FEMALE') &&
    typeof showcase?.height === 'number' &&
    typeof showcase?.size === 'string'
  )
}
