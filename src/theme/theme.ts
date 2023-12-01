import { createWeb3ModalTheme } from '@past3lle/forge-web3'
import {
  OFF_WHITE,
  createPast3lleTemplateTheme,
  getThemeColourByKeyCurried,
  getThemeColoursCurried,
} from '@past3lle/theme'

export const pastelleTheme = createPast3lleTemplateTheme('PASTELLE', {
  DARK: {
    content: {
      text: OFF_WHITE,
      background: 'rgb(0 0 0 / 55%)',
    },
    modeFilter: '',
    modeLogoFilter: 'invert(1) saturate(1.4) hue-rotate(180deg) drop-shadow(0px 0px 5px rgba(120,120,120,1))',
  },
  LIGHT: {
    content: {
      text: OFF_WHITE,
      background: 'rgb(248 248 255 / 17%)',
    },
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
          main: '#715e82',
          url: 'https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-600,w-360,q-60,bl-5',
        },
        button: {
          main: {
            font: {
              textShadow: '2px 2px 3px #ffffff47',
            },
            background: { default: '#24063e9e' },
            filter: 'hue-rotate(-315deg) saturate(1.2)',
            hoverAnimations: true,
          },
        },
        helpers: { show: true, font: { color: defaultThemeColours.red3 } },
        closeIcon: {
          size: 40,
        },
        title: {
          font: {
            style: 'normal',
            color: '#4b2e735c',
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
        filter: 'brightness(0.85) contrast(1.8)',
        button: {
          main: {
            background: { default: '#a6a7c8b5' },
            border: { border: 'none', radius: '1em' },
            filter: 'hue-rotate(10deg) saturate(4.5)',
            font: {
              color: 'ghostwhite',
              size: '1em',
              style: 'normal',
              weight: 200,
              letterSpacing: '-1px',
              textShadow: '2px 2px 3px #0000005c',
              textTransform: 'uppercase',
            },
            hoverAnimations: true,
          },
          active: {
            background: { default: '#37b9927d' },
          },
        },
      },
      account: {
        button: {
          main: {
            background: { default: '#7a67b0eb' },
          },
          alternate: {
            background: { default: '#a91111' },
          },
        },
        container: {
          main: {
            background: '#a6a7c861',
          },
          alternate: {
            background: '#a6a7c861',
          },
        },
        text: {
          main: {
            color: 'ghostwhite',
            weight: 700,
          },
          subHeader: {
            color: 'ghostwhite',
            weight: 400,
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
          main: 'white',
          url: 'https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-600,w-360,q-60,bl-5,e-grayscale',
        },
        closeIcon: {
          color: 'black',
          size: 55,
        },
        title: {
          font: {
            color: defaultThemeColours.red3,
          },
        },
      },
      account: {
        container: {
          main: {
            background: '#0b0b0b38',
          },
          alternate: {
            background: '#0b0b0b38',
          },
        },
        text: {
          header: {
            color: '#f8b792',
          },
          subHeader: {
            weight: 100,
          },
        },
        button: {
          main: {
            filter: 'saturate(0.6) hue-rotate(73deg)',
            background: { default: '#b08db396' },
            hoverAnimations: true,
          },
          alternate: {
            background: { default: '#c24e002b' },
          },
        },
      },
      connection: {
        button: {
          main: {
            font: {
              textShadow: '2px 2px 3px #ffffff47',
            },
            background: { default: '#24063e9e' },
            filter: 'invert(1) hue-rotate(45deg) saturate(2)',
            hoverAnimations: true,
          },
        },
      },
    },
  },
})
