import { ReactNode } from 'react'
import { ItemHeader } from 'pages/SingleItem/styleds'
import styled from 'styled-components/macro'
import { rotateKeyframe } from 'theme/styles/animations'

export const StyledSVG = styled.svg<{ size: string; stroke?: string }>`
  animation: 2s ${rotateKeyframe} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: ${({ stroke, theme }) => stroke ?? theme.primary1};
  }
`

type StyleParams = {
  top?: string
  right?: string
  bottom?: string
  left?: string
  width?: string
}

const FixedContainer = styled.div<StyleParams>`
  position: fixed;
  top: ${({ top = '25%' }) => top};
  bottom: ${({ bottom = '25%' }) => bottom};
  left: ${({ left = '25%' }) => left};
  right: ${({ right = '25%' }) => right};
  width: ${({ width = 'auto' }) => width};
`

export const FixedAnimatedLoader = ({
  loadText,
  animation = true,
  animationDelay = false,
  ...styleParams
}: { loadText: ReactNode; animation?: boolean; animationDelay?: boolean } & StyleParams) => (
  <FixedContainer {...styleParams}>
    <ItemHeader itemColor="#FFBEBC" animation={animation} animationDelay={animationDelay}>
      {loadText}
    </ItemHeader>
  </FixedContainer>
)

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function Loader({
  size = '16px',
  stroke,
  ...rest
}: {
  size?: string
  stroke?: string
  [k: string]: any
}) {
  return (
    <StyledSVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" size={size} stroke={stroke} {...rest}>
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSVG>
  )
}
