import { ThemeModes } from 'theme/styled'

import { ThemeToggle } from './ThemeToggle'
import { BSV, BV } from '../Button'
import { useThemeManager } from 'state/user/hooks'
import { Moon, Sun } from 'react-feather'
import { Row } from 'components/Layout'

const ThemeToggleBar: React.FC = () => {
  const { theme, setMode } = useThemeManager()
  const isDarkMode = theme.mode === ThemeModes.DARK
  const toggleDarkMode = () => setMode(isDarkMode ? ThemeModes.LIGHT : ThemeModes.DARK)

  return (
    <Row marginTop={'auto'}>
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
      <div>
        <Moon />
        <Sun />
      </div>
      <ThemeToggle
        mode={isDarkMode}
        size={BSV.DEFAULT}
        variant={BV.DARK_MODE_TOGGLE}
        margin="0.2rem"
        width="100%"
        onClick={toggleDarkMode}
      >
        {!isDarkMode ? <Moon /> : <Sun />}
      </ThemeToggle>
    </Row>
  )
}

export default ThemeToggleBar
