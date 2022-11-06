import { Z_INDEXES } from 'constants/config'
import { transparentize } from 'polished'
import styled from 'styled-components/macro'
import { TYPE } from 'theme'
import { BLACK, OFF_WHITE } from 'theme/utils'

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

export const ShowcaseAlertMessages = styled.div`
  width: 100%;
  height: min-content;
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${Z_INDEXES.PRODUCT_VIDEOS + 1};

  > div,
  > p,
  > span {
    position: relative;
    background-color: ${transparentize(0.5, BLACK)};
    padding: 0.5rem 1rem;
    width: inherit;
    font-size: 150%;
    font-weight: 600;
    color: ${OFF_WHITE};
    text-align: center;
    margin: 0.5rem 0;
  }
`
