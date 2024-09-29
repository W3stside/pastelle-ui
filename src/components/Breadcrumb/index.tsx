import { usePathname } from 'next/navigation'

export function useBreadcrumb() {
  const pathname = usePathname()
  const breadcrumbs = pathname?.split('/').slice()

  return { breadcrumbs, lastCrumb: breadcrumbs?.slice().pop() }
}
