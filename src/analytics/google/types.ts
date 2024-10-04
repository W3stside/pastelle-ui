import { ScriptProps } from 'next/script'

declare global {
  interface Window {
    dataLayer?: JSONValue[]
    [key: string]: unknown
  }
}

export type JSONValue = string | number | boolean | JSONValue[] | { [key: string]: JSONValue }

export type GTMParams = {
  gtmId: string
  gtmScriptUrl?: string
  dataLayer?: { [key: string]: JSONValue }
  dataLayerName?: string
  auth?: string
  preview?: string
  nonce?: string
  strategy?: ScriptProps['strategy']
}
