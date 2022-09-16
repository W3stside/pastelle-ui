export function getMobileShowcaseVideoWidth(innerContainerRef: HTMLDivElement | null) {
  return innerContainerRef?.clientWidth ? innerContainerRef?.clientWidth + 'px' : '120%'
}
