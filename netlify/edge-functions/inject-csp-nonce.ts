import type { IntegrationsConfig, Context } from '@netlify/edge-functions'
import crypto from 'node:crypto'
// @ts-expect-error - deno import
import { HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'

export default async (_: Request, context: Context) => {
  const response = await context.next()
  const GA_TAG_ID = Netlify.env.get('NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID')
  console.log('🚀 ~ GA_TAG_ID:', GA_TAG_ID)

  // Clone the response so we can modify it
  const newResponse = new Response(response.body, response)
  const contentType = newResponse.headers.get('Content-Type')

  // bail early
  if (!contentType || !contentType.includes('text/html')) return newResponse

  // Modify the CSP header to include the nonce
  let csp = newResponse.headers.get('Content-Security-Policy')

  // Generate a random nonce
  const nonce = crypto.randomBytes(16).toString('base64')
  if (csp) {
    const isProd = context?.deploy?.context !== 'dev'
    // Append 'nonce-{nonce}' to script-src and script-src-elem directives
    csp = csp.replace(/(script-src[^;]*)(;|$)/, (_, p1, p2) => `${p1} 'nonce-${nonce}'${p2}`)
    csp = csp.replace(/(script-src-elem[^;]*)(;|$)/, (_, p1, p2) => `${p1} 'nonce-${nonce}'${p2}`)
    if (isProd) {
      csp.replace(/ 'unsafe-eval'/, '')
      console.log(
        '[netlify/edge-functions/inject-csp-nonce.ts] PROD detected, remove unsafe-eval directive from script-src CSP. New CSP:',
        csp
      )
    }
    // Update the header
    newResponse.headers.set('Content-Security-Policy', csp)
  }

  // If the response is HTML, inject the nonce into script tags
  if (contentType && contentType.includes('text/html')) {
    // We inject the gtag.js scripts after the <head> tag
    return new HTMLRewriter()
      .on('head', {
        element(element) {
          // Insert GTA script tag right after the <head> tag
          element.after(
            `
            <script async id="_pastelle-gtag" src="https://www.googletagmanager.com/gtag/js?id=${GA_TAG_ID}"></script>
            <script id="_pastelle-gtag-init">
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TAG_ID}');
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                marketing_storage: 'denied',
                analytics_storage: 'granted'
              })
            </script>
          `,
            { html: true }
          )
        },
      })
      .on('script', {
        element(element) {
          if (element.getAttribute('id')?.includes('_pastelle-gtag')) {
            element.setAttribute('nonce', nonce)
          }
        },
      })
      .transform(newResponse)
  } else {
    // just return response
    return newResponse
  }
}

export const config: IntegrationsConfig = {
  path: '/*',
  name: 'inject-csp-nonce',
  cache: 'manual',
  onError: 'fail',
}
