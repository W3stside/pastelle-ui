import { ButtonProps, Row } from '@past3lle/components'
import { ReactNode, useCallback } from 'react'
import { useThemeManager } from '@/state/user/hooks'
import { ThemeModes } from '@/theme'

import { ThemeToggle, ThemeToggleProps } from './ThemeToggle'
import { getBaseButtonProps } from './utils'
import { toggleDarkModeAnalytics } from '@/analytics'

export const ThemeToggleButton = ({
  children,
  isDarkMode,
  toggleDarkMode,
  themeToggleProps = {
    margin: 'auto',
    width: '10rem',
    maxWidth: '120px',
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
  const toggleDarkMode = useCallback(() => {
    const mode = isDarkMode ? ThemeModes.LIGHT : ThemeModes.DARK
    toggleDarkModeAnalytics(isDarkMode)
    setMode(mode)
  }, [isDarkMode, setMode])

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
