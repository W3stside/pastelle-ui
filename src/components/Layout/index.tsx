import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ '@/components/Header'), {
  ssr: false,
})
const Navigation = dynamic(() => import(/* webpackChunkName: "NAVIGATION" */ '@/components/Navigation'), { ssr: false })
const Cookies = dynamic(() => import(/* webpackChunkName: "COOKIES" */ '@/components/Cookies/Banner'), { ssr: false })

interface Props {
  children: ReactNode
}
export function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <Navigation mobileHide />
      {children}
      <Cookies />
    </>
  )
}
