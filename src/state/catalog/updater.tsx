import { useEffect } from 'react'
import { useMockFetchCatalogDataByYear } from 'pages/Catalog/hooks'
import { useBatchUpdateCatalogByYear } from './hooks'
import { CatalogSeasonsMap } from 'mock/apparel/types'

const CURRENT_YEAR = new Date().getFullYear()
export default function Updater() {
  // 2022 winter/spring/summer/fall catalogs
  const {
    WINTER: { data: winterCatalog },
    SPRING: { data: springCatalog },
    SUMMER: { data: summerCatalog },
    FALL: { data: fallCatalog }
  } = useMockFetchCatalogDataByYear(CURRENT_YEAR)

  const batchUpdateCatalogByYear = useBatchUpdateCatalogByYear()

  useEffect(() => {
    const updatedCatalog: CatalogSeasonsMap = {
      WINTER: winterCatalog,
      SPRING: springCatalog,
      SUMMER: summerCatalog,
      FALL: fallCatalog
    }
    batchUpdateCatalogByYear({ year: CURRENT_YEAR, catalog: updatedCatalog })
  }, [batchUpdateCatalogByYear, fallCatalog, springCatalog, summerCatalog, winterCatalog])
  return null
}
