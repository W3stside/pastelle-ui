'use client'
import React from 'react'
import Script from 'next/script'

import type { GTMParams } from './types'

import { devWarn } from '@past3lle/utils'

if (!process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID) {
  devWarn('Missing GoogleTagManager tag id. Check .env. Not throwing and app continuing without GA.')
}

export function GoogleTagManager(props: Omit<GTMParams, 'preview'>) {
  const { gtmId, gtmScriptUrl = 'https://www.googletagmanager.com/gtag/js', nonce, strategy } = props

  return (
    <>
      <Script id="_pastelle-gtag" nonce={nonce} strategy={strategy} src={`${gtmScriptUrl}?id=${gtmId}`} />
    </>
  )
}
