import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ '@/components/Header'))
const Navigation = dynamic(() => import(/* webpackChunkName: "NAVIGATION" */ '@/components/Navigation'))
const Cookies = dynamic(() => import(/* webpackChunkName: "COOKIES" */ '@/components/Cookies/Banner'))

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
