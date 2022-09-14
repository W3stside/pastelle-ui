import styled from 'styled-components/macro'
import { transparentize } from 'polished'
import { Row } from 'components/Layout'

export const CarouselStep = styled(Row)<{
  $transformAmount: number
  $width: number
  $height?: string
}>`
  position: absolute;
  top: 0;
  left: 0;
  transform: ${({ $transformAmount }) => `translateX(${$transformAmount}px)`};
  width: ${({ $width }) => $width}px;
  ${({ $height }) => $height && `height: ${$height};`}
  overflow: hidden;

  z-index: ${({ $transformAmount }) => ($transformAmount > 0 ? 1 : 0)};

  // TODO: BE SURE THIS ISNT SHITTY
  align-items: flex-start;

  img {
    max-width: 100%;
    box-shadow: 3px 6px 8px 0px #686868ad;
  }

  // transform one differently than the others
  transition: ${({ $transformAmount }) =>
    $transformAmount > 0 ? 'transform 1s ease-in-out;' : 'transform 0.7s ease-out'};
`

export const CarouselContainer = styled.div<{ fixedHeight?: string }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  // transform requirement
  position: relative;
  overflow: hidden;
  width: 100%;
  z-index: 1;
  ${({ fixedHeight }) => `height: ${fixedHeight};`}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    > ${CarouselStep} {
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
