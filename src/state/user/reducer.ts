import { PastelleTheme as Theme } from '@past3lle/theme'
import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { ElementType } from 'react'
import { ProductSizes } from '@/shopify/graphql/types'
import { ThemeModes } from '@/theme'

const currentTimestamp = () => new Date().getTime()

export type ShowcaseGender = 'MALE' | 'FEMALE'
export type ShowcaseHeight = 165 | 175 | 185 | 190

export type BannerType = 'OFFLINE' | 'MISC'
export type BannerMessages = Record<
  BannerType,
  | null
  | {
      elem: ElementType
      id?: string
      className?: string
      content?: string
      url?: string
      style?: React.CSSProperties
    }[]
>
export interface UserState {
  theme: Pick<Theme, 'mode' | 'autoDetect'>
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number
  showcase: {
    gender: ShowcaseGender
    height: ShowcaseHeight
    size: ProductSizes
    videoSettings: { autoplay: boolean; status: 'play' | 'pause' }
  }
  bannerMessages: BannerMessages
}

export const initialState: UserState = {
  theme: {
    mode: ThemeModes.DARK,
    autoDetect: false,
  },
  showcase: {
    gender: 'MALE',
    height: 175,
    size: ProductSizes.L,
    videoSettings: { autoplay: true, status: 'play' },
  },
  bannerMessages: {
    OFFLINE: null,
    MISC: null,
  },
}

function _setBannerStateIfMissing(state: UserState) {
  if (typeof state?.bannerMessages === 'undefined') {
    state.bannerMessages = initialState.bannerMessages
  } else {
    Object.keys(initialState.bannerMessages).map((bannerType) => {
      const bannerState = state.bannerMessages
      if (typeof bannerState?.[bannerType as BannerType] === 'undefined') {
        bannerState[bannerType as BannerType] = initialState.bannerMessages[bannerType as BannerType]
      }
    })
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addBannerMessage(state, { payload }: PayloadAction<{ key: BannerType; message: BannerMessages[BannerType] }>) {
      _setBannerStateIfMissing(state)
      state.bannerMessages[payload.key] = payload.message
    },
    removeBannerMessage(state, { payload }: PayloadAction<{ key: BannerType }>) {
      _setBannerStateIfMissing(state)
      state.bannerMessages[payload.key] = null
    },
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
    },
  },
})
export const { addBannerMessage, removeBannerMessage, updateThemeAutoDetect, updateThemeMode, updateShowcaseSettings } =
  userSlice.actions
export const user = userSlice.reducer

function _isShowcaseState(showcase: UserState['showcase']) {
  return (
    (showcase?.gender === 'MALE' || showcase?.gender === 'FEMALE') &&
    typeof showcase?.height === 'number' &&
    typeof showcase?.size === 'string' &&
    typeof showcase?.videoSettings?.autoplay === 'boolean' &&
    typeof showcase?.videoSettings?.status === 'string'
  )
}
