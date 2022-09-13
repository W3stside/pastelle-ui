import styled from 'styled-components/macro'
import { transparentize } from 'polished'

import { Column, Row } from 'components/Layout'
import { DEFAULT_IK_TRANSFORMS, Z_INDEXES } from 'constants/config'
import { ItemHeader, ItemSubHeader } from 'pages/SingleItem/styleds'
import { fromExtraLarge, OFF_WHITE, upToExtraSmall, upToMedium, upToSmall } from 'theme/utils'
import { ProductBrandingAssets } from 'shopify/graphql/types'
import { QuantitySelectorWrapper } from 'hooks/useQuantitySelector'
import { setFadeInAnimation } from 'theme/styles/animations'

export const CartLineContent = styled(Row)`
  display: grid;
  // span, pic, content
  grid-template-columns: auto min-content;
  background: ${({ theme }) => theme.purple1};
  padding: 1rem;

  cursor: pointer;

  // content wrapper
  > ${Row}:first-child {
    flex-flow: row wrap;
    gap: 0 0.8rem;
    justify-content: flex-start;
    text-align: left;
    padding: 0 2rem;

    > ${ItemSubHeader} {
      flex: 0 1 max-content;

      // view item
      &:nth-child(3) {
        flex: 1 1 100%;
      }

      ${upToExtraSmall`
        font-size: 1.8rem;

        &:not(&:first-child) {
          font-size: 1.2rem;
        }
      `}
    }
  }

  ${upToExtraSmall`
    > ${QuantitySelectorWrapper} {
      flex-flow: column-reverse nowrap;
      padding: 0 3rem 0 0;
      > button {
        width: 100%;
      }
      > svg {
        position: absolute;
        right: 3rem;
      }
    }
  `}
`

export const CartLineWrapper = styled(Row)<{
  brandAssetMap: Partial<ProductBrandingAssets> | undefined
  color?: string
}>`
  border-radius: 1rem;

  > div {
    display: grid;
    // span, pic, content
    grid-template-columns: 0px 12rem auto;
    text-align: center;
    max-height: 14rem;
    width: 100%;

    ${upToSmall`
      grid-template-columns: 0px 8rem auto;
    `}
  }

  background: ${({ theme, brandAssetMap, color }) =>
    brandAssetMap?.header
      ? `url(${brandAssetMap?.header}?tr=${DEFAULT_IK_TRANSFORMS.HQ_LOGO}) center repeat, url(${brandAssetMap?.header}?tr=${DEFAULT_IK_TRANSFORMS.LQ_LOGO}) center repeat`
      : color || transparentize(0.3, theme.bg1)};

  background-color: ${({ theme, color = transparentize(0.3, theme.bg1) }) => color};
  background-size: initial;
  background-blend-mode: unset;

  border-top: 1px solid black;

  padding: 1rem;

  img {
    max-width: 100%;
    cursor: pointer;
  }

  input[type='number'] {
    min-width: unset;
    width: 5rem;
  }
`

export const ShoppingCartQuantityWrapper = styled(Row)`
  padding: 0.2rem 0.4rem;
  border-radius: 2rem;
  background-color: ${({ theme }) => theme.purple1};
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`

export const ShoppingCartFullWrapper = styled.div``

export const ShoppingCartHeaderWrapper = styled(Row)`
  justify-content: space-evenly;
  gap: 1rem;
  background: ${({ theme }) => theme.offWhite};
  padding: 1rem 1.5rem;
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

export const CartHeader = styled(ItemHeader).attrs(props => ({
  ...props,
  color: OFF_WHITE,
  itemColor: 'transparent',
  animation: false
}))``

export const CartTableHeaderWrapper = styled(Row)`
  display: grid;
  grid-template-columns: min-content auto min-content;
  text-align: center;
  grid-gap: 9rem;

  ${upToMedium`
  > ${ItemHeader} {
    font-size: 6rem;
    letter-spacing: -0.5rem;
  }
  > ${Column} > ${ItemHeader} {
    font-size: 3.2rem;
  }
`}
  ${upToSmall`
  grid-gap: 4rem;
  > ${ItemHeader} {
    font-size: 4rem;
    letter-spacing: -0.5rem;
  }
  > ${Column} > ${ItemHeader} {
    font-size: 2rem;
  }
`}
`
export const ShoppingCartPanelContentWrapper = styled(Column)`
  overflow: hidden;
  overflow-y: auto;
  #lenny-face {
    font-style: normal;
  }
  > ${Row} {
    margin: 1rem 0;

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
  cursor: initial;

  // animation
  filter: contrast(1) blur(0px);
  ${setFadeInAnimation({ duration: 0.4 })}

  > ${ShoppingCartPanelContentWrapper}, > ${CartTableHeaderWrapper} {
    color: ${({ theme }) => theme.text1};
    // background: ${({ theme }) => transparentize(0.2, theme.black)};
    background-color: ${({ theme }) => transparentize(0.1, theme.black)};
    margin-left: auto;
    width: 80%;
    
    ${upToSmall`
      width: 100%;
      padding: 1rem;
    `}

    padding-left: 3rem;
    padding-right: 3rem;
    
    ${fromExtraLarge`
      width: 40%;
    `}
  }
  
  > ${CartTableHeaderWrapper} {
    padding: 2rem;
  }
  
  > ${ShoppingCartPanelContentWrapper} {
    padding-bottom: 18rem;
    height: 100%;
  }
`
