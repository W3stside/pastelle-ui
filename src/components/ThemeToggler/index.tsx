import styled from 'styled-components/macro'
import { useCallback } from 'react'
import { THEME_LIST, ThemeModes } from 'theme/styled'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon, faSmileWink } from '@fortawesome/free-regular-svg-icons'

import { ThemeToggle } from './ThemeToggle'
import { BSV, BV } from '../Button'
import { useThemeManager } from 'state/user/hooks'

import vampireIcon from 'assets/png/vampire.png'
import chameleonIcon from 'assets/png/chameleon.png'
import { ItemSubHeader } from 'pages/SingleItem/styleds'

const LogoImg = styled.img`
  max-width: 100%;
`

function _getTogglerIcon(mode: ThemeModes): { icon: IconDefinition | string | null; isDark: boolean } {
  switch (mode) {
    case ThemeModes.LIGHT:
      return { icon: faSun as IconDefinition, isDark: false }
    case ThemeModes.DARK:
      return { icon: faMoon as IconDefinition, isDark: false }
    case ThemeModes.VAMPIRE:
      return { icon: vampireIcon, isDark: true }
    case ThemeModes.CHAMELEON:
      return { icon: chameleonIcon, isDark: false }
    default:
      return { icon: faSmileWink as IconDefinition, isDark: false }
  }
}

const ThemeToggleBar: React.FC = () => {
  const { theme, setMode, setAutoDetect } = useThemeManager()

  const handleModeSelect = useCallback(
    (mode: ThemeModes) => {
      if (theme.autoDetect) {
        setAutoDetect(false)
      }

      setMode(mode)
    },
    [setAutoDetect, setMode, theme.autoDetect]
  )

  return (
    <>
      {/* <ThemeToggle
        mode={theme.autoDetect}
        size={BSV.DEFAULT}
        variant={theme.autoDetect ? BV.PRIMARY : BV.DISABLED}
        margin="0.2rem"
        width="6rem"
        onClick={() => setAutoDetect(!theme.autoDetect)}
      >
        Auto
      </ThemeToggle> */}
      <ItemSubHeader color="#fff">THEME</ItemSubHeader>
      {THEME_LIST.slice(2).map(([key, name], index) => {
        const isActiveMode = theme.mode === name
        const icon = _getTogglerIcon(name)

        return (
          <ThemeToggle
            mode={isActiveMode}
            size={BSV.DEFAULT}
            variant={isActiveMode ? BV.PRIMARY : BV.DISABLED}
            margin="0.2rem"
            width="6rem"
            onClick={() => handleModeSelect(name)}
            key={key + '_' + index}
            disabled={isActiveMode}
          >
            {typeof icon?.icon === 'string' ? (
              <LogoImg src={icon.icon} style={{ filter: `invert(${isActiveMode && icon.isDark ? 1 : 0})` }} />
            ) : icon.icon ? (
              <FontAwesomeIcon icon={icon.icon} size="lg" />
            ) : null}
          </ThemeToggle>
        )
      })}
    </>
  )
}

export default ThemeToggleBar
