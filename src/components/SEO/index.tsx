import Head from 'next/head'
import React from 'react'

import { CollectionSchema, ProductSchema } from './types'

if (!process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID) {
  console.warn('Missing GoogleTagManager tag id. Check .env. Not throwing and app continuing without GA.')
}

interface SEOProps {
  title: string
  description: string
  name: string
  image: string | null
  cannonicalUrl: string
  schema: ProductSchema | CollectionSchema | null
  type?: string
}

export default function SEO({ title, description, name, cannonicalUrl, type = 'website', image, schema }: SEOProps) {
  return (
    <Head>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Facebook tags */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:description" content={description} />
      <meta property="og:url" content={cannonicalUrl} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Cannonical link */}
      <link rel="canonical" href={`https://pastelle.shop/${cannonicalUrl}`} />

      {/* Schema */}
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Head>
  )
}
