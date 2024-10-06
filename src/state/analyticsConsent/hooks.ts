import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '..'
import { GoogleAnalyticsConsentState, updateGoogleAnalyticsConsent } from './reducer'
import { MakeOptional } from '@past3lle/types'

export function useGoogleAnalyticsConsentSelector() {
  return useAppSelector((state) => state.analyticsConsent.google)
}

export function useDispatchGoogleConsent() {
  const dispatch = useAppDispatch()
  return useCallback(
    (params: MakeOptional<GoogleAnalyticsConsentState, keyof GoogleAnalyticsConsentState>) =>
      dispatch(updateGoogleAnalyticsConsent(params)),
    [dispatch],
  )
}
