import debounce from 'lodash.debounce'
import { ErrorInfo } from 'react'
import ReactGA from 'react-ga4'
import { GaOptions, InitOptions, UaEventOptions } from 'react-ga4/types/ga4'

export enum Dimensions {
  chainId = 'chainId',
  walletName = 'walletName',
  customBrowserType = 'customBrowserType',
}

const DIMENSION_MAP = {
  [Dimensions.chainId]: 'dimension1',
  [Dimensions.walletName]: 'dimension2',
  [Dimensions.customBrowserType]: 'dimension3',
}

type DimensionKey = keyof typeof DIMENSION_MAP

/**
 * Google Analytics Provider containing all methods used throughout app to log events to Google Analytics.
 */
export default class GoogleAnalyticsProvider {
  dimensions: { [key in DimensionKey]: unknown }

  constructor() {
    this.dimensions = { chainId: '', walletName: '', customBrowserType: '' }
  }

  public send(hitType: string, ...restArgs: unknown[]) {
    ReactGA.send({ hitType, ...restArgs })
  }

  public sendEvent(event: string | UaEventOptions, params?: unknown) {
    if (typeof event === 'object') {
      event = { ...event, ...this.parseDimensions() }
    }

    ReactGA.event(event, params)
  }

  private parseDimensions() {
    const output: { [key: string]: unknown } = {}

    for (const [key, value] of Object.entries(this.dimensions)) {
      if (key in DIMENSION_MAP && value) {
        output[DIMENSION_MAP[key as DimensionKey]] = value
      }
    }

    return output
  }

  public sendError(error: Error, errorInfo: ErrorInfo) {
    ReactGA.event('exception', { description: error.toString() + errorInfo.toString(), fatal: true })
  }

  public initialize(
    GA_MEASUREMENT_ID: InitOptions[] | string,
    options?: {
      legacyDimensionMetric?: boolean
      nonce?: string
      testMode?: boolean
      gaOptions?: GaOptions & { debug?: boolean; siteSpeedSampleRate?: number; storage?: string; storeGac?: boolean }
      gtagOptions?: unknown
    },
  ) {
    ReactGA.initialize(GA_MEASUREMENT_ID, options)
  }

  public set(fieldsObject: unknown) {
    ReactGA.set(fieldsObject)
  }

  public outboundLink(
    {
      url,
    }: {
      url: string
    },
    hitCallback: () => unknown,
  ) {
    this.ga('send', 'event', 'outbound', 'click', url, {
      transport: 'beacon',
      hitCallback,
    })
  }

  public _pageview(page_path?: string, _?: string[], title?: string) {
    ReactGA.send({ hitType: 'pageview', page_path, title, ...this.parseDimensions() })
  }

  // debounced because otherwise it will be called 2 times
  // setTimeout because it will show the title of previous page until Helmet is loaded
  public pageview = debounce((page_path?: string, _?: string[], title?: string) => {
    setTimeout(() => this._pageview(page_path, _, title), 1000)
  })

  public ga(...args: unknown[]) {
    ReactGA.ga(...args)
  }

  public gaCommandSendTiming(timingCategory: unknown, timingVar: unknown, timingValue: unknown, timingLabel: unknown) {
    ReactGA._gaCommandSendTiming(timingCategory, timingVar, timingValue, timingLabel)
  }

  public setDimension(key: DimensionKey, value: unknown) {
    this.dimensions[key] = value
  }

  public gtag(...data: unknown[]) {
    return ReactGA.gtag(...data)
  }
}
