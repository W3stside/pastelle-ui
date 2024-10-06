import { Column, Row } from '@past3lle/components'
import { OFF_WHITE, fromExtraLarge, setFadeInAnimation, upToExtraSmall, upToMedium, upToSmall } from '@past3lle/theme'
import { TRANSPARENT_HEX, Z_INDEXES } from '@/constants/config'
import { QuantitySelectorWrapper } from 'hooks/useQuantitySelector/styled'
import { ItemHeader, ProductSubHeader } from '@/components/PagesComponents/styleds'
import { transparentize } from 'polished'
import styled from 'styled-components/macro'
import { BLACK_TRANSPARENT_MORE } from '@/theme'

export const CartLineContent = styled(Row)`
  display: grid;
  // span, pic, content
  grid-template-columns: auto min-content;
  background: ${({ theme }) => theme.purple1};
  padding: 1rem;

  cursor: pointer;

  // content wrapper
  > ${Row}:first-of-type {
    flex-flow: row wrap;
    gap: 0 0.8rem;
    justify-content: flex-start;
    text-align: left;
    padding: 0 2rem;

    > ${ProductSubHeader} {
      flex: 0 1 max-content;

      // view item
      &:nth-child(3) {
        flex: 1 1 100%;
      }

      ${upToExtraSmall`
        font-size: 1.8rem;

        &:not(&:first-of-type) {
          font-size: 1.2rem;
        }
      `}
    }
  }

  ${upToExtraSmall`
    > ${QuantitySelectorWrapper} {
      position: relative;
      flex-flow: column-reverse nowrap;
      padding: 0 3rem 0 0;
      > button {
        width: 100%;
      }
      > svg {
        position: absolute;
        right: 0;
      }
    }
  `}
`

export const CartLineWrapper = styled(Row)<{
  bgLogo: string | undefined
  color?: string | null
}>`
  border-radius: ${({ theme }) => theme.button.border.radius};

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

  background: ${({ theme, bgLogo, color }) =>
    bgLogo
      ? `url(${bgLogo}) center / contain repeat, url(${bgLogo}) center -56px / contain repeat`
      : color || transparentize(0.3, theme.bg1)};

  background-color: ${({ theme, color }) => color || transparentize(0.3, theme.bg1)};
  background-size: initial;
  background-blend-mode: difference;

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

export const ShoppingCartFullWrapper = styled(Row)`
  height: 100%;
  min-width: 86px;
`

export const ShoppingCartHeaderWrapper = styled(Row)`
  height: 100%;
  justify-content: space-evenly;
  gap: 1rem;
  > svg:first-child,
  > ${ShoppingCartQuantityWrapper} {
    filter: invert(1);
  }
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

export const CartHeader = styled(ItemHeader).attrs((props) => ({
  ...props,
  color: OFF_WHITE,
  itemColor: TRANSPARENT_HEX,
  animation: false,
}))`
  font-variation-settings: 'wght' 700;
  > a {
    text-decoration: none;
    color: ${OFF_WHITE};
  }
  > svg:first-child {
    max-width: 100% !important;
    min-width: 6.5rem;
    margin-right: 0.4rem;
  }
`
export const CartTableHeaderBaseWrapper = styled(Row)`
  text-align: center;
  line-height: 1;
  grid-gap: 0.5rem;

  > svg {
    cursor: pointer;
    margin-left: auto;
  }

  ${upToMedium`
  > ${Column} > ${ItemHeader} {
    font-size: 3.2rem;
  }
`}
  ${upToSmall`
  > ${ItemHeader} {
    font-size: 3.2rem;
    letter-spacing: -1px;
  }
  > ${Column} > ${ItemHeader} {
    font-size: 2rem;
  }
`}
`
export const CartTableHeaderWrapper = styled(CartTableHeaderBaseWrapper)<{ gridTemplateColumns?: string }>`
  display: grid;
  grid-template-columns: ${({ gridTemplateColumns = 'min-content auto min-content' }) => gridTemplateColumns};
  grid-gap: 2rem;
`
export const ShoppingCartPanelContentWrapper = styled(Column)`
  height: 100vh;
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
  display: grid;
  grid-template-rows: min-content auto min-content;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: ${Z_INDEXES.SHOPPING_CART};
  cursor: initial;

  background-color: ${BLACK_TRANSPARENT_MORE};

  // animation
  filter: contrast(1) blur(0px);
  ${setFadeInAnimation({ duration: 0.4 })}

  > ${ShoppingCartPanelContentWrapper}, > ${CartTableHeaderWrapper}, > ${CartTableHeaderBaseWrapper} {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => transparentize(0.3, theme.black)};
    margin-left: auto;
    width: 60%;
    padding: 1rem 2rem 2rem;

    // HEADER
    &:first-of-type {
      padding: 1rem 3rem;
    }
    // FOOTER
    &:last-child {
      padding-left: 3rem;
      padding-right: 3rem;
    }

    ${upToSmall`
      // HEADER
      &:first-of-type {
        padding: 1.5rem;
      }
      // FOOTER
      &:last-child {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    `}

    ${upToMedium`
      width: 100%;
    `}
    
    ${fromExtraLarge`
      width: 50%;
    `}
  }

  > ${ShoppingCartPanelContentWrapper} {
    padding: 0 3rem 18rem;
    height: 100%;

    ${upToSmall`
      padding: 0 1rem 18rem;
    `}
  }
`
