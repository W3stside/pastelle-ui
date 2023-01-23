import { Text as PSTLText } from '@past3lle/components'
import { ReactElement } from 'react'
import { TextProps } from 'rebass/styled-components'
import styled, { useTheme } from 'styled-components/macro'

const TextWrapper = styled(PSTLText.Basic)``
export const Text = {
  ...PSTLText,
  ProductText(props: TextProps): ReactElement {
    const theme = useTheme()
    const color = theme.products.aside.textColor
    return <TextWrapper colour={color} fontWeight={500} {...props} />
  }
}
