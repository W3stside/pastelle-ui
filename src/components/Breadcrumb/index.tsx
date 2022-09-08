import { useParseCatalogDetailsFromURL } from 'state/catalog/hooks'

export function useBreadcrumb() {
  const [, params] = useParseCatalogDetailsFromURL()

  const lastCrumb = params.slice().pop()
  return { breadcrumbs: params, lastCrumb }
}
