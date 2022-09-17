export function getMobileShowcaseVideoWidth(innerContainerRef: HTMLElement | null) {
  return innerContainerRef?.clientWidth ? innerContainerRef.clientWidth + 'px' : '120%'
}

export function getMobileShowcaseVideo916Height(innerContainerRef: HTMLElement | null) {
  return innerContainerRef?.clientWidth ? (innerContainerRef.clientWidth * 9) / 16 + 'px' : '120%'
}
