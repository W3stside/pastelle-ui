'use client'
import React from 'react'
import Script from 'next/script'

import type { GTMParams } from './types'

export function GoogleTagManager(props: Omit<GTMParams, 'preview'>) {
  const {
    gtmId,
    gtmScriptUrl = 'https://www.googletagmanager.com/gtag/js',
    dataLayerName = 'dataLayer',
    // dataLayer,
    auth,
    nonce,
    strategy,
  } = props

  const gtmLayer = dataLayerName !== 'dataLayer' ? `&l=${dataLayerName}` : ''
  const gtmAuth = auth ? `&gtm_auth=${auth}` : ''

  return (
    <>
      <Script
        id="_next-gtm"
        data-ntpc="GTM"
        nonce={nonce}
        strategy={strategy}
        src={`${gtmScriptUrl}?id=${gtmId}${gtmLayer}${gtmAuth}`}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>
    </>
  )
}
