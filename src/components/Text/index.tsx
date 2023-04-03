import { Text as PSTLText, TextProps } from '@past3lle/components'
import { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/macro'

const TextWrapper = styled(PSTLText.Basic)``
export const Text = {
  ...PSTLText,
  ProductText({ fontWeight = 500, ...props }: TextProps): ReactElement {
    const theme = useTheme()
    const color = theme.content.text
    return <TextWrapper colour={color} fvs={{ wght: fontWeight, ...props.fvs }} {...props} />
  },
}
