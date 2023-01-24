import { PNG } from '@past3lle/assets'
import { BSV, BV, ButtonProps, Row } from '@past3lle/components'
import { ThemeModes } from '@past3lle/theme'
import { ReactNode } from 'react'
import { useThemeManager } from 'state/user/hooks'
import { ShopImageSrcSet } from 'types'

import { ThemeToggle, ThemeToggleProps } from './ThemeToggle'

export const getBaseButtonProps = (isDarkMode: boolean, toggleDarkMode: () => void): ButtonProps => ({
  size: BSV.DEFAULT,
  variant: BV.DARK_MODE_TOGGLE,
  bgImage: { defaultUrl: PNG.LogoCircle_2x } as ShopImageSrcSet,
  backgroundColor: isDarkMode ? 'darkslategrey' : 'blue',
  filter: 'invert(' + isDarkMode ? '1' : '0' + ') contrast(2) saturate(2)',
  bgBlendMode: 'lighten',
  bgAttributes: ['0px / 10% repeat', '0px / 100% no-repeat'],
  onClick: toggleDarkMode,
})

export const ThemeToggleButton = ({
  children,
  isDarkMode,
  toggleDarkMode,
  themeToggleProps = {
    margin: 'auto',
    width: '10rem',
  },
  buttonProps = {},
}: {
  children?: ReactNode
  isDarkMode: boolean
  toggleDarkMode: () => void
  themeToggleProps?: ThemeToggleProps
  buttonProps?: ButtonProps
}) => (
  <ThemeToggle
    mode={isDarkMode}
    margin={themeToggleProps.margin}
    width={themeToggleProps.width}
    buttonProps={{ ...getBaseButtonProps(isDarkMode, toggleDarkMode), ...buttonProps }}
  >
    {children}
  </ThemeToggle>
)

const ThemeToggleBar = ({
  buttonProps = {},
  themeToggleProps = {},
  className,
}: {
  className?: string
  themeToggleProps?: ThemeToggleProps
  buttonProps?: ButtonProps
}) => {
  const { mode, setMode } = useThemeManager()
  const isDarkMode = mode === ThemeModes.DARK
  const toggleDarkMode = () => setMode(isDarkMode ? ThemeModes.LIGHT : ThemeModes.DARK)

  return (
    <Row className={className} justifyContent="center" width="100%">
      <ThemeToggleButton
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        themeToggleProps={themeToggleProps}
        buttonProps={buttonProps}
      >
        <span id="theme-toggle-label">{isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}</span>
      </ThemeToggleButton>
    </Row>
  )
}

export default ThemeToggleBar
