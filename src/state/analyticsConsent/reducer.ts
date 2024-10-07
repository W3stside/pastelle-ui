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
  google: { configured: boolean; consent: GoogleAnalyticsConsentState }
}

export const initialState: AnalyticsState = {
  google: {
    configured: false,
    consent: {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
      marketing_storage: 'denied',
    },
  },
}

const analyticsConsentSlice = createSlice({
  name: 'analyticsConsent',
  initialState,
  reducers: {
    setGoogleAnalyticsConfigured(state, { payload }: PayloadAction<boolean>) {
      state.google.configured = payload
    },
    updateGoogleAnalyticsConsent(
      state,
      { payload }: PayloadAction<MakeOptional<GoogleAnalyticsConsentState, keyof GoogleAnalyticsConsentState>>
    ) {
      if (!state.google.configured) state.google.configured = true

      state.google = {
        ...state.google,
        consent: {
          ...state.google.consent,
          ...payload,
        },
      }
    },
  },
})
export const { updateGoogleAnalyticsConsent, setGoogleAnalyticsConfigured } = analyticsConsentSlice.actions
export const analyticsConsent = analyticsConsentSlice.reducer
