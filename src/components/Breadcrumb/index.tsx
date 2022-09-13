import { useLocation } from 'react-router-dom'

export function useBreadcrumb() {
  const { pathname } = useLocation()
  const breadcrumbs = pathname.split('/').slice()

  return { breadcrumbs, lastCrumb: breadcrumbs.slice().pop() }
}
