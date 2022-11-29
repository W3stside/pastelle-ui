import styled from 'styled-components/macro'
import { SectionFrame } from '../Layout/Section'
import { upToSmall } from 'theme/utils'
import { ShoppingCartHeader } from 'components/ShoppingCart'
import { ShoppingCartFullWrapper } from 'components/ShoppingCart/styled'
import ThemeToggleBar from 'components/ThemeToggler'

const FooterWrapper = styled(SectionFrame)`
  display: none;

  ${upToSmall`
    display: flex;
    position: fixed;
    bottom: 0;
    padding: 1rem;
    background-color: #000000d1;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    > ${ShoppingCartFullWrapper} {
      margin-left: auto;
    }
  `}
`

function Footer() {
  return (
    <FooterWrapper as="footer">
      {/* <NavLogo parentNode={node} logoSrcSet={headerLogoSet} /> */}
      <ThemeToggleBar
        themeToggleProps={{
          margin: '0 auto 0 0',
          width: '10rem'
        }}
      />
      <ShoppingCartHeader />
    </FooterWrapper>
  )
}

export default Footer
