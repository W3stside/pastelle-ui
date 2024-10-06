import { BaseProductPageProps } from '@/components/PagesComponents/types'
import { useEffect } from 'react'
import { sendProductViewEvent } from '../events/productViewEvents'

export function useProductViewReporter(product: BaseProductPageProps | undefined | null) {
  useEffect(() => {
    if (product) sendProductViewEvent(product)
    // Safely disable because product ID is unique
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])
}
