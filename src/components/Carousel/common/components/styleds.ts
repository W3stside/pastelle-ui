import styled from 'styled-components/macro'
import { transparentize } from 'polished'
import { Row } from 'components/Layout'
import { ScrollerContainer } from 'components/ScrollingContentPage/styleds'
import { Z_INDEXES } from 'constants/config'
import { BLACK, OFF_WHITE } from 'theme/utils'

const BaseCarouselStep = styled(Row)<{
  $width: number
  $height?: string
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ $width }) => $width}px;
  ${({ $height }) => $height && `height: ${$height};`}
  overflow: hidden;
  // TODO: BE SURE THIS ISNT SHITTY
  align-items: flex-start;

  img {
    max-width: 100%;
    // box-shadow: 3px 6px 8px 0px #686868ad;
  }
`

export const AnimatedCarouselStep = styled(BaseCarouselStep)``
export const StaticCarouselStep = styled(BaseCarouselStep)<{
  $transformAmount: number
}>`
  transform: ${({ $transformAmount }) => `translateX(${$transformAmount}px)`};

  // transform one differently than the others
  transition: ${({ $transformAmount }) =>
    $transformAmount > 0 ? 'transform 1s ease-in-out;' : 'transform 0.7s ease-out'};

  z-index: ${({ $transformAmount }) => ($transformAmount > 0 ? 1 : 0)};
`

export const CarouselContainer = styled(ScrollerContainer).attrs({ $isVerticalScroll: false })<{
  $fixedHeight?: string
  $fixedWidth?: string
}>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  // transform requirement
  position: relative;
  overflow: hidden;
  width: 100%;
  z-index: 1;
  ${({ $fixedHeight }) => `height: ${$fixedHeight};`}
  ${({ $fixedWidth }) => `width: ${$fixedWidth};`}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    > ${StaticCarouselStep} {
        max-width: 100%;
        height: auto;
      }
  `}
`

export const CarouselButton = styled.div<{ buttonColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 10%;
  background-color: ${({ buttonColor }) => transparentize(1, buttonColor)};

  cursor: pointer;

  &:hover {
    background-color: ${({ buttonColor }) => transparentize(0.7, buttonColor)};
  }

  transition: background-color 0.2s ease-in-out;
`

export const CarouselButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  cursor: pointer;
`

export const CarouselIndicator = styled.div<{ isCurrent: boolean; color?: string }>`
  background: ${({ isCurrent, theme, color = theme.blackOpaque2 }) => (isCurrent ? color : 'transparent')};
  color: ${({ isCurrent }) => (isCurrent ? BLACK : OFF_WHITE)};
  border: 1px solid ${({ isCurrent, theme, color = theme.blackOpaque2 }) => (isCurrent ? 'transparent' : color)};
  border-radius: 1rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  // filter: hue-rotate(124deg) invert(0);
`
export const CarouselIndicatorWrapper = styled(Row)`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.9rem;
  gap: 0.5rem;
  width: 18%;
  height: 2rem;
  justify-content: center;
  align-items: stretch;
  z-index: ${Z_INDEXES.SCROLLER_DIV + 200};
`
