import { MINIMUM_COLLECTION_ITEM_HEIGHT } from '@/constants/config'

export function getMobileShowcaseVideoWidth(innerContainerRef: HTMLElement | null) {
  return innerContainerRef?.clientWidth ? innerContainerRef.clientWidth + 'px' : '120%'
}

export function getMobileShowcaseVideo916Height(innerContainerRef: HTMLElement | null) {
  return innerContainerRef?.clientWidth ? (innerContainerRef.clientWidth * 9) / 16 + 'px' : '120%'
}

export function setHeightLqTransforms(
  node: HTMLElement | undefined | null,
  {
    showLoading = false,
    heightDefault = MINIMUM_COLLECTION_ITEM_HEIGHT,
  }: { heightDefault?: number; showLoading?: boolean },
) {
  return {
    width: node?.clientHeight || heightDefault,
    height: node?.clientHeight || heightDefault,
    showLoadingIndicator: !!showLoading,
  }
}
export function setWidthLqTransforms(
  node: HTMLElement | undefined | null,
  { showLoading = false, widthDefault = 500 }: { widthDefault?: number; showLoading?: boolean },
) {
  return {
    width: node?.clientWidth || widthDefault,
    height: node?.clientWidth || widthDefault,
    showLoadingIndicator: !!showLoading,
  }
}
