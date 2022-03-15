import { BaseCatalogItem } from './types'

export function buildUrl({ year, name, season }: BaseCatalogItem, type: 'VIDEOS' | 'IMAGES', id: string) {
  return `/APPAREL/${year}/${season}/${name}/${type}/${id}`
}
