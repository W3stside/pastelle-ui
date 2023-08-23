import { createPast3lleTemplateTheme, getThemeColourByKeyCurried, getThemeColoursCurried } from '@past3lle/theme'
import { createTheme } from '@past3lle/web3-modal'

export const pastelleTheme = createPast3lleTemplateTheme('PASTELLE', {
  DARK: {
    modeFilter: '',
    modeLogoFilter: 'invert(1) saturate(1.4) hue-rotate(180deg) drop-shadow(0px 0px 5px rgba(120,120,120,1))',
  },
  LIGHT: {
    modeFilter: 'invert(1) brightness(0.65) contrast(1.8) hue-rotate(247deg) saturate(2)',
    modeLogoFilter: 'drop-shadow(0px 10px 12px rgba(120,120,120,0.75))',
  },
})

export const getThemeColourByKey = getThemeColourByKeyCurried(pastelleTheme)
export const getThemeColours = getThemeColoursCurried(pastelleTheme)
export const defaultThemeColours = getThemeColours('DEFAULT')

export const pstlModalTheme = createTheme({
  DEFAULT: {
    modals: {
      connection: {
        filter: 'brightness(0.85) contrast(1.8)',
        backgroundImg: 'https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-600,w-360,q-60,bl-5',
        baseFontSize: 20,
        helpers: { show: true, color: defaultThemeColours.red3 },
        closeIcon: {
          size: '40px',
        },
        title: {
          color: '#ffffff9c',
          fontWeight: 700,
          letterSpacing: '-1.4px',
          lineHeight: 0.82,
        },
        button: {
          backgroundColor: '#6c5c84ab',
          connectedBackgroundColor: '#37b9927d',
          border: { border: 'none', radius: '1em' },
          color: 'ghostwhite',
          fontSize: '1em',
          fontStyle: 'normal',
          fontWeight: 200,
          letterSpacing: '-1px',
          textShadow: '2px 2px 3px #0000005c',
          textTransform: 'uppercase',
          hoverAnimations: true,
        },
      },
      // account: {
      //   balanceAndAddressContainer: {
      //     backgroundColor: 'black',
      //   },
      // },
    },
  },
  DARK: {
    modals: {
      connection: {
        filter:
          'invert(1) brightness(0.85) contrast(1.4) hue-rotate(160deg) saturate(1.8)' ||
          'invert(1) brightness(0.85) contrast(1.2) hue-rotate(115deg) saturate(2.5)',
        backgroundImg:
          'https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-600,w-360,q-60,bl-5,e-grayscale',
        baseFontSize: 20,
        helpers: { show: true, color: defaultThemeColours.red3 },
        closeIcon: {
          color: 'black',
          size: '40px',
        },
        title: {
          color: defaultThemeColours.red3,
          fontWeight: 700,
          letterSpacing: '-1.4px',
          lineHeight: 0.82,
        },
        button: {
          backgroundColor: '#6c5c84ab',
          connectedBackgroundColor: '#37b9927d',
          border: { border: 'none', radius: '1em' },
          color: 'ghostwhite',
          fontStyle: 'normal',
          fontWeight: 200,
          letterSpacing: '-1px',
          textShadow: '2px 2px 3px #0000005c',
          textTransform: 'uppercase',
          hoverAnimations: true,
        },
      },
      account: {
        balanceAndAddressContainer: {
          backgroundColor: '#ffffff6e',
        },
      },
    },
  },
  get LIGHT() {
    return this.DEFAULT
  },
})
