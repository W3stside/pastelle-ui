import { useGetCatalogDetailsFromURL } from 'pages/Catalog/hooks'

export function useBreadcrumb() {
  const [, params] = useGetCatalogDetailsFromURL()

  const lastCrumb = params.slice().pop()
  return { breadcrumbs: params, lastCrumb }
}
