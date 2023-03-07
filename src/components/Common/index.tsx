import { BLACK, OFF_WHITE } from '@past3lle/theme'
import { Text as TYPE } from 'components/Text'
import { Z_INDEXES } from 'constants/config'
import { transparentize } from 'polished'
import styled from 'styled-components/macro'

export const TinyHelperTextStyled = styled(TYPE.ProductText)`
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
  width: max-content;
  height: min-content;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: ${Z_INDEXES.PRODUCT_VIDEOS + 1};

  > div,
  > p,
  > span {
    position: relative;
    background-color: ${transparentize(0.2, BLACK)};
    padding: 0.5rem 1rem;
    width: inherit;
    font-size: 150%;
    font-weight: 600;
    color: ${OFF_WHITE};
    text-align: center;
    margin: 0.5rem 0;

    &:first-of-type {
      margin-top: 0;
    }
  }
`
