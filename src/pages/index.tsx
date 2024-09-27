import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const Home = dynamic(() => import(/* webpackPrefetch: true,  webpackChunkName: "HOME" */ '@/pages/home'), {
  ssr: false,
})

// TODO: check this ignore. Doing this here as next probably does some magic with this from this file
// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
}

export default function RootLayout() {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#2c2f36" />
        <link rel="manifest" href="/manifest.json" />

        <title>HEAVY STREETWEAR. PORTUGAL | PASTELLE</title>
        <meta
          name="description"
          content="Organic, heavy-streetwear locally designed and produced in Portugal. The GENES1S Pastelle collection available now!"
        />
      </Head>
      <Home />
    </>
  )
}
