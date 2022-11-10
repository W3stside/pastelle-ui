import styled, { css, FlattenInterpolation, ThemeProps, DefaultTheme, ThemedStyledProps } from 'styled-components/macro'
import { variants } from 'styled-theming'
import ThemeProvider from 'theme'

import { darken, transparentize } from 'polished'
import { THEME_LIST, ThemeModes } from 'theme/styled'
import { BoxProps } from 'rebass'
import { setCssBackground } from 'theme/utils'

export type Writable<T> = {
  -readonly [K in keyof T]: T[K]
}

export interface ButtonBaseProps extends React.ButtonHTMLAttributes<Element> {
  variant?: ButtonVariations
  size?: ButtonSizeVariations
}

export enum ButtonVariations {
  DEFAULT = 'DEFAULT',
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  DANGER = 'DANGER',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  CANCEL = 'CANCEL',
  DISABLED = 'DISABLED',
  THEME = 'THEME'
}

export enum ButtonSizeVariations {
  DEFAULT = 'DEFAULT',
  SMALL = 'SMALL',
  BIG = 'BIG'
}

// Aliases
export const BV = ButtonVariations
export const BSV = ButtonSizeVariations

const BUTTON_VARIATION_LIST = Object.entries(ButtonVariations)

const DEFAULT_DARKEN_AMOUNT = 0.2

const PRIMARY_BUTTON_STYLES = css`
  color: ${({ theme }): string => theme.text1};
  background: ${({ theme }): string => theme.offWhite};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.bg1)};
  }
`

const SECONDARY_BUTTON_STYLES = css`
  color: ${({ theme }): string => theme.text1};
  background: ${({ theme }): string => theme.bg3};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.bg3)};
  }
`

const DANGER_BUTTON_STYLES = css`
  color: ${({ theme }): string => theme.red1};
  background: ${({ theme }): string => theme.red2};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.red2)};
    border-color: ${({ theme }): string => theme.red1};
  }
`

const SUCCESS_BUTTON_STYLES = css`
  color: ${({ theme }): string => theme.green1};
  background: ${({ theme }): string => theme.green2};

  &:hover {
    background: linear-gradient(270deg, #8958ff 0%, #3f77ff 100%);
    border-color: ${({ theme }): string => theme.offWhite};
    color: ${({ theme }): string => theme.offWhite};
  }

  transition: background, color 0.3s ease-out;
`

const WARNING_BUTTON_STYLES = css`
  color: ${({ theme }): string => theme.yellow1};
  background: ${({ theme }): string => theme.yellow2};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.yellow2)};
    border-color: ${({ theme }): string => theme.yellow1};
  }
`

const CANCEL_BUTTON_STYLES = css`
  color: ${({ theme }): string => theme.text3};
  background: ${({ theme }): string => theme.bg1};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.bg1)};
    border-color: ${({ theme }): string => theme.text3};
  }
`

const DISABLED_BUTTON_STYLES = css`
  color: ${({ theme }): string => theme.textDisabled};
  background: ${({ theme }): string => theme.bgDisabled};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.bgDisabled)};
    border-color: ${({ theme }): string => theme.textDisabled};
  }
`

const THEME_BUTTON_STYLES = css`
  color: ${({ theme }): string => theme.offWhite};
  border-color: ${({ theme }): string => theme.offWhite};

  filter: contrast(2) saturate(3);
  border-color: ${({ theme }): string => theme.text1};
  text-shadow: 0px 0px 12px #fff;

  > div {
    border-radius: 0.1rem;

    background-color: black;
    opacity: 0.66;

    transition: background-color, filter, opacity 0.2s ease-out;
  }

  &:hover {
    filter: contrast(1.5) saturate(10);
    border-color: ${({ theme }): string => theme.text1};

    > div {
      background-color: black;
      opacity: 0.66;
      filter: invert(1);
    }
  }

  transition: text-shadow, background-color, filter 0.2s ease-in-out;
`

type ButtonVariationInterpolationObject = {
  [key in keyof typeof ButtonVariations]: ThemeInterpolationObject
}

type ThemeInterpolationObject = {
  [key in keyof typeof ThemeModes]: FlattenInterpolation<ThemeProps<DefaultTheme>>
}

const ButtonThemeMap: Writable<ButtonVariationInterpolationObject> = BUTTON_VARIATION_LIST.reduce(
  (accum, [, buttonVariant]) => {
    // buttonStyle = 'secondary' or 'primary' etc style
    let buttonStyle: FlattenInterpolation<ThemedStyledProps<
      { bgImage?: string; frameBgColor?: string | undefined },
      DefaultTheme
    >>

    switch (buttonVariant) {
      case ButtonVariations.DEFAULT:
        buttonStyle = PRIMARY_BUTTON_STYLES
        break
      case ButtonVariations.PRIMARY:
        buttonStyle = PRIMARY_BUTTON_STYLES
        break
      case ButtonVariations.SECONDARY:
        buttonStyle = SECONDARY_BUTTON_STYLES
        break
      case ButtonVariations.DANGER:
        buttonStyle = DANGER_BUTTON_STYLES
        break
      case ButtonVariations.SUCCESS:
        buttonStyle = SUCCESS_BUTTON_STYLES
        break
      case ButtonVariations.WARNING:
        buttonStyle = WARNING_BUTTON_STYLES
        break
      case ButtonVariations.CANCEL:
        buttonStyle = CANCEL_BUTTON_STYLES
        break
      case ButtonVariations.DISABLED:
        buttonStyle = DISABLED_BUTTON_STYLES
        break
      case ButtonVariations.THEME:
        buttonStyle = THEME_BUTTON_STYLES
        break
    }

    accum[buttonVariant] = THEME_LIST.reduce<Writable<ThemeInterpolationObject>>((accum2, [, themeName]) => {
      // { 'LIGHT': css` ... `, 'DARK': css` ... `, ... }
      accum2[themeName] = buttonStyle
      return accum2
    }, {} as ThemeInterpolationObject)

    return accum
  },
  {} as Writable<ButtonVariationInterpolationObject>
)

export const ButtonTheme = variants('mode', 'variant', ButtonThemeMap)

// name of the key we will look for on our theme object
// used to target buttons
const BUTTON_THEME_KEY = 'button'
// Created a 'size' prop on buttons, default | small | big
const ButtonSizes = variants('component', 'size', {
  DEFAULT: {
    [BUTTON_THEME_KEY]: css`
      font-size: ${({ theme }) => theme.buttons.font.size.normal};
      padding: 0.5rem 1rem;
    `
  },
  SMALL: {
    [BUTTON_THEME_KEY]: css`
      font-size: ${({ theme }) => theme.buttons.font.size.small};
      padding: 0.3rem 1rem;
    `
  },
  BIG: {
    [BUTTON_THEME_KEY]: css`
      font-size: ${({ theme }) => theme.buttons.font.size.large};
      padding: 0.65rem 1.2rem;
    `
  }
})

type ButtonStyleProps = BoxProps & {
  borderRadius?: string
  backgroundColor?: string
  gradientColours?: string[]
  margin?: string
  padding?: string
}

export type ButtonProps = ButtonBaseProps & ButtonStyleProps & { bgImage?: string }

const ButtonBase = styled.button.attrs(props => props)<ButtonStyleProps>`
  border: none;
  border-radius: 0.1rem;
  cursor: pointer;
  font-size: ${({ theme }) => theme.buttons.font.size.normal};
  font-weight: 600;
  outline: 0;

  transition-duration: 0.2;
  transition-timing-function: ease-in-out;
  transition-property: color, background, background-color, border-color, opacity, margin;

  &:disabled,
  &[disabled] {
    pointer-events: none;
    background-color: #292928;
  }
`

const ColouredButtonBase = styled(ButtonBase)`
  /* Fold in theme css above */
  ${ButtonTheme}
`

const ColouredAndSizedButtonBase = styled(ColouredButtonBase)`
  /* Fold in theme css above */
  ${ButtonSizes}
`

// Wrap ColouredAndSizedButtonsBase in it's own ThemeProvider which takes the toplevel app theme
// ThemeProvider and interpolate over it's props
const ThemeWrappedButtonBase: React.FC<React.ButtonHTMLAttributes<Element>> = ({ children, ...restProps }) => (
  <ThemeProvider themeExtension={{ component: BUTTON_THEME_KEY }}>
    <ColouredAndSizedButtonBase {...restProps}>{children}</ColouredAndSizedButtonBase>
  </ThemeProvider>
)

export default styled(ThemeWrappedButtonBase).attrs<ButtonBaseProps & ButtonStyleProps>(
  ({ size = BSV.DEFAULT, ...restProps }) => ({
    ...restProps,
    size
  })
)<ButtonProps>`
  ${({ backgroundColor }) => backgroundColor && `background-color: ${backgroundColor};`}
  ${({ color }) => color && `color: ${color};`}
  ${({ margin }) => margin && `margin: ${margin};`}
  ${({ padding }) => padding && `padding: ${padding};`}
  ${({ theme, bgImage, backgroundColor = transparentize(0.3, theme.bg1) }) =>
    bgImage
      ? setCssBackground(theme, {
          isLogo: true,
          imageUrls: [bgImage, bgImage],
          backgroundColor,
          backgroundAttributes: ['center / cover no-repeat', '5px / cover repeat'],
          backgroundBlendMode: 'difference'
        })
      : theme.bg1}
`
