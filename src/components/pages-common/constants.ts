export const DEFAULT_MEDIA_START_INDEX = 0
const CTA_BUTTON_COMMON_PROPS = {
  innerHoverFilter: 'unset',
  fontWeight: 200,
  color: 'ghostwhite',
  innerBgColor: 'unset',
  textShadow: '2px 3px 3px #000000cf',
}
export const CTA_BUTTON_PROP_THEMES = {
  VENUS: {
    ...CTA_BUTTON_COMMON_PROPS,
    filter: 'invert(1) contrast(1.3) saturate(1.3) hue-rotate(1deg)',
    hoverFilter: 'unset',
    backgroundColor: '#86fff3',
  },
  HADES: {
    ...CTA_BUTTON_COMMON_PROPS,
    filter: 'contrast(1.5) hue-rotate(36deg)',
    hoverFilter: 'contrast(2) hue-rotate(105deg)',
    innerFilter: 'unset',
    backgroundColor: 'ghostwhite',
  },
  get GLACIUS() {
    return {
      ...this.VENUS,
      backgroundColor: '#456577',
    }
  },
}
