import type { DocumentContext, DocumentInitialProps } from 'next/document'
import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components/macro'
import crypto from 'crypto'
import { AppType } from 'next/app'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    // Generate a nonce
    const nonce = crypto.randomBytes(16).toString('base64')

    // lock the sheet
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: AppType<{ nonce: string }>) => (props) =>
            sheet.collectStyles(<App {...props} pageProps={{ ...props.pageProps, nonce }} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      }
    } finally {
      sheet.seal()
    }
  }
}
