import { LqImageOptions, SmartImageProps } from 'components/SmartImg'
import { LoadInViewOptions } from 'hooks/useDetectScrollIntoView'
import { GenericImageSrcSet } from 'shopify/graphql/types'

export interface BaseCarouselProps {
  imageList: GenericImageSrcSet[]
  startIndex: number
  buttonColor: string
  fixedHeight?: string
  collectionView?: boolean
  transformation?: SmartImageProps['transformation']
  loadInViewOptions?: LoadInViewOptions
  lqImageOptions?: LqImageOptions
  fullSizeContent?: boolean
  onImageClick?: () => void
}
