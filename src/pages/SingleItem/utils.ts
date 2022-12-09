import { MINIMUM_COLLECTION_ITEM_HEIGHT } from 'constants/config'

export function getMobileShowcaseVideoWidth(innerContainerRef: HTMLElement | null) {
  return innerContainerRef?.clientWidth ? innerContainerRef.clientWidth + 'px' : '120%'
}

export function getMobileShowcaseVideo916Height(innerContainerRef: HTMLElement | null) {
  return innerContainerRef?.clientWidth ? (innerContainerRef.clientWidth * 9) / 16 + 'px' : '120%'
}

export function setCatalogImagesLqProps(node: HTMLElement | null, isCollectionView: boolean) {
  return isCollectionView
    ? {
        width: (node?.clientWidth || 1) * 0.6 || 500,
        height: node?.clientHeight || MINIMUM_COLLECTION_ITEM_HEIGHT,
        showLoadingIndicator: false
      }
    : {
        width: node?.clientWidth || 0,
        height: node?.clientWidth || 0,
        showLoadingIndicator: true
      }
}
