import { Row } from '@past3lle/components'
import { OFF_WHITE } from '@past3lle/theme'
import { ProductSubHeader } from '@/components/PagesComponents/styleds'
import { ReactNode } from 'react'

import { CartLineWrapper } from './styled'

export const QuantityBubble: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProductSubHeader
    display="flex"
    alignItems="center"
    justifyContent="center"
    margin="0.5rem"
    fontSize="2rem"
    fontStyle="normal"
    fontWeight={700}
    width={40}
    height={40}
    backgroundColor="#458445"
    style={{ position: 'absolute', bottom: 0, left: 0, borderRadius: 30 }}
  >
    {children}
  </ProductSubHeader>
)

export const LoadingCartLine: React.FC = () => (
  <CartLineWrapper bgLogo={undefined}>
    <div style={{ position: 'relative' }}>
      <Row>
        <ProductSubHeader color={OFF_WHITE} fontSize="2.2rem" fontWeight={100} padding={'0 2rem'} margin={0}>
          Fetching cart items. . .
        </ProductSubHeader>
      </Row>
    </div>
  </CartLineWrapper>
)
