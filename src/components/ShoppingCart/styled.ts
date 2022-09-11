import styled from 'styled-components/macro'
import { transparentize } from 'polished'

import { Column, Row } from 'components/Layout'
import { Z_INDEXES } from 'constants/config'
import { fadeInAnimation } from 'pages/SingleItem/styleds'
import { upToMedium, upToSmall } from 'theme/utils'

export const CartLineWrapper = styled(Row)`
  display: grid;
  grid-template-columns: 0px 0.25fr minmax(6rem, 0.4fr) minmax(13rem, 1fr) 0.25fr minmax(11rem, 0.7fr);
  text-align: center;

  border-top: 1px solid black;

  padding: 10px;

  img {
    max-width: 100%;
  }

  input[type='number'] {
    min-width: unset;
    width: 5rem;
  }
`

export const ShoppingCartQuantityWrapper = styled(Row)`
  padding: 0.2rem 0.4rem;
  border-radius: 2rem;
  background-color: red;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`

export const ShoppingCartWrapper = styled(Row)`
  justify-content: space-evenly;
  gap: 1rem;
  background: ${({ theme }) => theme.offWhite};
  padding: 1rem;
  margin-left: auto;
  width: fit-content;
  border-radius: 0.5rem;
  cursor: pointer;

  > svg,
  > ${ShoppingCartQuantityWrapper} {
    flex: 1 1 50%;
  }

  > svg {
    color: ${({ theme }) => theme.black};
  }
`

export const ShoppingCartPanelContentWrapper = styled(Column)`
  z-index: 400;
  > ${Row} {
    margin: 0;

    > svg {
      margin: 0 2rem;
      cursor: pointer;
    }
  }
`

export const ShoppingCartPanelWrapper = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: ${Z_INDEXES.SHOPPING_CART};
  background-color: ${({ theme }) => transparentize(0.5, theme.black)};
  cursor: initial;

  // animation
  filter: contrast(1) blur(0px);
  ${fadeInAnimation};
  animation-name: fadeIn;
  animation-duration: 0.4s;

  > ${ShoppingCartPanelContentWrapper} {
    color: ${({ theme }) => theme.text1};
    background: ${({ theme }) => transparentize(0.1, theme.offWhite)};
    padding: 0 2rem 2rem;
    margin-left: auto;
    width: 40%;
    height: 100%;

    ${upToMedium`
    width: 70%;
  `}

    ${upToSmall`
      width: 100%;
    `}
  }
`
