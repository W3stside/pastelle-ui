import { Text as PSTLText, TextProps } from '@past3lle/components'
import { ReactElement } from 'react'
import { useTheme } from 'styled-components/macro'
import { TextWrapper } from './styled'

export const Text = {
  ...PSTLText,
  ProductText({ fontWeight = 500, ...props }: TextProps): ReactElement {
    const theme = useTheme()
    const color = theme.content.text
    return <TextWrapper colour={color} fvs={{ wght: fontWeight, ...props.fvs }} {...props} />
  },
}
