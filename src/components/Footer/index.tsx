import styled from 'styled-components/macro'
import { SectionFrame } from '../Layout/Section'
import { upToExtraSmall } from 'theme/utils'
import { ShoppingCartHeader } from 'components/ShoppingCart'
import { ShoppingCartFullWrapper } from 'components/ShoppingCart/styled'

const FooterWrapper = styled(SectionFrame)`
  display: none;

  ${upToExtraSmall`
    display: flex;
    position: fixed;
    bottom: 0;
    padding: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    > ${ShoppingCartFullWrapper} {
      margin-left: auto;

    }
  `}
`

const Footer = () => {
  return (
    <FooterWrapper as="footer">
      <ShoppingCartHeader />
    </FooterWrapper>
  )
}

export default Footer
