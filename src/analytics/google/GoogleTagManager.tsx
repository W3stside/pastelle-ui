'use client'
import React from 'react'
import Script from 'next/script'

import type { GTMParams } from './types'

export function GoogleTagManager(props: GTMParams) {
  const {
    gtmId,
    gtmScriptUrl = 'https://www.googletagmanager.com/gtm.js',
    dataLayerName = 'dataLayer',
    auth,
    preview,
    dataLayer,
    nonce,
    strategy,
  } = props

  const gtmLayer = dataLayerName !== 'dataLayer' ? `&l=${dataLayerName}` : ''
  const gtmAuth = auth ? `&gtm_auth=${auth}` : ''
  const gtmPreview = preview ? `&gtm_preview=${preview}&gtm_cookies_win=x` : ''

  return (
    <>
      <Script
        id="_next-gtm-init"
        strategy={strategy}
        dangerouslySetInnerHTML={{
          __html: `
      (function(w,l){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        ${dataLayer ? `w[l].push(${JSON.stringify(dataLayer)})` : ''}
      })(window,'${dataLayerName}');`,
        }}
        nonce={nonce}
      />
      <Script
        id="_next-gtm"
        data-ntpc="GTM"
        nonce={nonce}
        strategy={strategy}
        src={`${gtmScriptUrl}?id=${gtmId}${gtmLayer}${gtmAuth}${gtmPreview}`}
      />
    </>
  )
}
