import styled from 'styled-components/macro'
import { ItemSubHeader } from 'pages/SingleItem/styleds'

export type ScrollingIndicatorParams = ScrollingIndicatorStyleProps & {
  baseContentMessage: string
  onlyOne?: 'TOP' | 'BOTTOM'
}

export interface ScrollingIndicatorStyleProps {
  bgColor?: string
  left?: string
  top?: string
  bottom?: string
  padding?: string
  height?: string
  width?: string
  zIndex?: number
}

const Wrapper = styled.div<ScrollingIndicatorStyleProps>`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ bgColor = '#fa9b6f' }) => bgColor};
    color: ${({ color = '#000' }) => color};
    right: 0;
    ${({ left }) => left && `left: ${left};`}
    ${({ top }) => top && `top: ${top};`}
    ${({ bottom }) => bottom && `bottom: ${bottom};`}
    height: ${({ height = '50px' }) => height};
    width: ${({ width = '100%' }) => width};
    padding: ${({ padding = '0 10px' }) => padding};
    z-index: ${({ zIndex = 1 }) => zIndex};
  `

export function ScrollingContentIndicator({
  baseContentMessage = 'MORE CONTENT',
  onlyOne,
  // isLastIndex,
  ...styleProps
}: ScrollingIndicatorParams) {
  return (
    <>
      {onlyOne !== 'BOTTOM' && (
        <Wrapper {...styleProps} top={'0px'}>
          <ItemSubHeader>{baseContentMessage}</ItemSubHeader>
        </Wrapper>
      )}
      {onlyOne !== 'TOP' && (
        <Wrapper {...styleProps} bottom={'50px'}>
          <ItemSubHeader>{baseContentMessage}</ItemSubHeader>
        </Wrapper>
      )}
    </>
  )
}
