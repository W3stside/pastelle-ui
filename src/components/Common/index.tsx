import styled from 'styled-components/macro'
import { TYPE } from 'theme'

export const TinyHelperTextStyled = styled(TYPE.black)`
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
`

type TinyHelperTextParams = { label?: string; handleClick?: () => void }
export function TinyHelperText({ label = 'What is this?', handleClick }: TinyHelperTextParams) {
  return <TinyHelperTextStyled onClick={handleClick}>[+] {label}</TinyHelperTextStyled>
}
