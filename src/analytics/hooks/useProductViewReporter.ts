import { BaseProductPageProps } from '@/components/pages-common/types'
import { useEffect } from 'react'
import { sendProductViewEvent } from '../events/productViewEvents'

export function useProductViewReporter(product: BaseProductPageProps | undefined | null) {
  useEffect(() => {
    if (product) sendProductViewEvent(product)
  }, [product])
}
