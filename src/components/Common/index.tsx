import styled from 'styled-components/macro'
import { TYPE } from 'theme'

export const TinyHelperTextStyled = styled(TYPE.black)`
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
`

type TinyHelperTextParams = { css?: string; label?: string; handleClick?: () => void }
export function TinyHelperText({ css, label = 'What is this?', handleClick }: TinyHelperTextParams) {
  return (
    <TinyHelperTextStyled onClick={handleClick} css={css}>
      [+] {label}
    </TinyHelperTextStyled>
  )
}
