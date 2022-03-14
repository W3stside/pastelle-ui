const MOCK_BREADCRUMB = ['Home', 'Longsleeve', 'VIRGIL']

export function useBreadcrumb() {
  const lastCrumb = MOCK_BREADCRUMB.slice().pop()
  return { breadcrumbs: MOCK_BREADCRUMB, lastCrumb }
}
