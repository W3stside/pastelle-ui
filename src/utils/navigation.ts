import { APPAREL_PARAM_NAME, COLLECTION_PATHNAME } from '@/constants/navigation'

export function buildItemUrl(handle: string) {
  // TODO: reenable itemKey
  return `/${APPAREL_PARAM_NAME}/${handle}`
}

export function checkIsCollectionPage({ pathname }: Pick<Location, 'pathname'>) {
  return pathname === COLLECTION_PATHNAME
}
