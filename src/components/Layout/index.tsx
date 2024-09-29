import { ReactNode } from 'react'
// import { CookiesBanner } from '../Cookies/Banner'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ '@/components/Header'), {
  ssr: false,
})
const Navigation = dynamic(() => import(/* webpackChunkName: "NAVIGATION" */ '@/components/Navigation'), { ssr: false })

interface Props {
  children: ReactNode
}
export function Layout({ children }: Props) {
  return (
    <>
      {/* HEADER + NAVIGATION */}
      <Header />
      <Navigation mobileHide />
      {children}
      {/* COOKIES */}
      {/* 
      // TODO: reinstate when @past3lle/components is updated to fix localstorage server check
      <CookiesBanner /> */}
    </>
  )
}
