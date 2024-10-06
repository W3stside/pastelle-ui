import type { IntegrationsConfig, Context } from '@netlify/edge-functions'
import crypto from 'node:crypto'
// @ts-expect-error - deno import
import { HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'

export default async (_: Request, context: Context) => {
  const response = await context.next()

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
    // Append 'nonce-{nonce}' to script-src and script-src-elem directives
    csp = csp.replace(/(script-src[^;]*)(;|$)/, (_, p1, p2) => `${p1} 'nonce-${nonce}'${p2}`)
    csp = csp.replace(/(script-src-elem[^;]*)(;|$)/, (_, p1, p2) => `${p1} 'nonce-${nonce}'${p2}`)
    // Update the header
    newResponse.headers.set('Content-Security-Policy', csp)
  }

  // If the response is HTML, inject the nonce into script tags

  if (contentType && contentType.includes('text/html')) {
    // const text = await newResponse.text()

    // // Add nonce attribute to script tags that don't have it
    // const newText = addOrReplaceNonce(text, nonce)

    // // Return the modified response
    // return new Response(newText, newResponse)
    return new HTMLRewriter()
      .on('script', {
        element(element) {
          if (element.getAttribute('id')?.includes('_next-gtm')) {
            element.setAttribute('nonce', nonce)
          }
        },
      })
      .transform(await context.next())
  } else {
    // just return response
    return newResponse
  }
}

// function addOrReplaceNonce(html, nonce) {
//   // First, find <script> tags with id="_next-gtm-init" or id containing "_next-gtm" that don't have a nonce
//   return html
//     .replace(
//       /<script\b([^>]*\bid="_next-gtm-init"[^>]*|\bid="[^"]*_next-gtm[^"]*"[^>]*)\b(?!nonce=)[^>]*>/gi,
//       (match, p1) => {
//         // Add the nonce attribute
//         return match.replace('<script', `<script ${p1} nonce="${nonce}"`)
//       }
//     )
//     .replace(
//       /<script\b([^>]*\bid="_next-gtm-init"[^>]*|\bid="[^"]*_next-gtm[^"]*"[^>]*)\bnonce="[^"]*"[^>]*>/gi,
//       (match) => {
//         // If there's already a nonce, replace the old one
//         return match.replace(/\bnonce="[^"]*"/, `nonce="${nonce}"`)
//       }
//     )
// }

// function addOrReplaceNonce(html, nonce) {
//   // First, find <script> tags with class="{{SERVER_NONCE}}" that don't have a nonce
//   return html
//     .replace(/<script\b([^>]*\bclass="[^"]*\b{{SERVER_NONCE}}\b[^"]*")[^>]*\b(?!nonce=)[^>]*>/gi, (match, p1) => {
//       // Add the nonce attribute
//       return match.replace('<script', `<script ${p1} nonce="${nonce}"`)
//     })
//     .replace(/<script\b([^>]*\bclass="[^"]*\b{{SERVER_NONCE}}\b[^"]*")[^>]*\bnonce="[^"]*"[^>]*>/gi, (match) => {
//       // If there's already a nonce, replace the old one
//       return match.replace(/\bnonce="[^"]*"/, `nonce="${nonce}"`)
//     })
// }

export const config: IntegrationsConfig = {
  path: '/*',
  //   generator: '@cool-framework/nice-plugin@1.0.0',
  name: 'inject-csp-nonce',
  cache: 'manual',
  onError: 'bypass',
}
