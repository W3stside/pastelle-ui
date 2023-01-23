import { TFC } from 'react'
import ThemeProvider from 'theme'

import Button, { BSV, BV } from '../Button'
import { LightCard } from '../Layout/Card'

const ThemeConsumer: TFC = ({ theme }) => {
  if (!theme) return <div>No active theme detected.</div>

  return (
    <div>
      <h1>Theme Manager</h1>
      <h4>
        Your current app theme is: <p style={{ fontSize: 'large' }}>{theme.mode}</p>
      </h4>
      <LightCard>{JSON.stringify(theme, null, 2)}</LightCard>
      <br />
      <Button variant={BV.PRIMARY}>Default Button Example</Button>{' '}
      <Button size={BSV.BIG} variant={BV.SECONDARY}>
        Big Button Example
      </Button>{' '}
      <Button size={BSV.SMALL} variant={BV.WARNING}>
        Small Button Example
      </Button>
    </div>
  )
}

const ThemeViewer: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  )
}

export default ThemeViewer
