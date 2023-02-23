import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  name: string
  type?: string
}

export default function SEO({ title, description, name, type = 'website' }: SEOProps) {
  return (
    <Helmet titleTemplate="%s | PASTELLE">
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} data-rh="true" />

      {/* Facebook tags */}
      <meta property="og:type" content={type} data-rh="true" />
      <meta property="og:title" content={title} data-rh="true" />
      <meta property="og:description" content={description} data-rh="true" />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} data-rh="true" />
      <meta name="twitter:card" content={type} data-rh="true" />
      <meta name="twitter:title" content={title} data-rh="true" />
      <meta name="twitter:description" content={description} data-rh="true" />
    </Helmet>
  )
}
