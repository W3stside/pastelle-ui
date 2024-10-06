import { MakeOptional } from '@past3lle/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface GoogleAnalyticsConsentState {
  ad_storage: 'granted' | 'denied'
  ad_user_data: 'granted' | 'denied'
  ad_personalization: 'granted' | 'denied'
  analytics_storage: 'granted' | 'denied'
  marketing_storage: 'granted' | 'denied'
}
export interface AnalyticsState {
  google: GoogleAnalyticsConsentState
}

export const initialState: AnalyticsState = {
  google: {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
    marketing_storage: 'denied',
  },
}

const analyticsConsentSlice = createSlice({
  name: 'analyticsConsent',
  initialState,
  reducers: {
    updateGoogleAnalyticsConsent(
      state,
      { payload }: PayloadAction<MakeOptional<GoogleAnalyticsConsentState, keyof GoogleAnalyticsConsentState>>,
    ) {
      state.google = {
        ...state.google,
        ...payload,
      }
    },
  },
})
export const { updateGoogleAnalyticsConsent } = analyticsConsentSlice.actions
export const analyticsConsent = analyticsConsentSlice.reducer
