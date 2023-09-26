import { createWeb3ModalTheme } from '@past3lle/forge-web3'
import { createPast3lleTemplateTheme, getThemeColourByKeyCurried, getThemeColoursCurried } from '@past3lle/theme'

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

export const pstlModalTheme = createWeb3ModalTheme({
  DEFAULT: {
    modals: {
      base: {
        padding: '1em',
        baseFontSize: 20,
        background: {
          backgroundImg: 'https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-600,w-360,q-60,bl-5',
        },
        helpers: { show: true, font: { color: defaultThemeColours.red3 } },
        closeIcon: {
          size: 40,
        },
        title: {
          font: {
            style: 'normal',
            color: '#ffffff9c',
            weight: 700,
            letterSpacing: '-1.4px',
            lineHeight: 0.82,
            size: '2.5em',
            textAlign: 'left',
          },
          margin: '10px 0 0 20px',
        },
      },
      connection: {
        baseFontSize: 20,
        filter: 'brightness(0.85) contrast(1.8)',
        button: {
          background: {
            background: '#6c5c84ab',
            connected: '#37b9927d',
          },
          font: {
            color: 'ghostwhite',
            size: '1em',
            style: 'normal',
            weight: 200,
            letterSpacing: '-1px',
            textShadow: '2px 2px 3px #0000005c',
            textTransform: 'uppercase',
          },
          border: { border: 'none', radius: '1em' },
          hoverAnimations: true,
        },
      },
      account: {
        baseFontSize: 10,
        text: {
          main: {
            font: {
              weight: 700,
            },
          },
        },
      },
    },
  },
  DARK: {
    modals: {
      base: {
        filter: 'invert(1) brightness(0.85) contrast(1.4) hue-rotate(160deg) saturate(1.8)',
        background: {
          backgroundImg:
            'https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-600,w-360,q-60,bl-5,e-grayscale',
        },
        closeIcon: {
          color: 'black',
        },
        title: {
          font: {
            color: defaultThemeColours.red3,
          },
        },
      },
      account: {
        container: {
          addressAndBalance: {
            background: {
              background: '#ffffff6e',
            },
          },
        },
        button: {
          disconnect: {
            background: {
              background: '#a9165a',
            },
          },
        },
      },
    },
  },
})
