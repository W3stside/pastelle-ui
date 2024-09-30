import { bgPositionAnimation, setAnimation } from '@past3lle/theme'
import { Fragment, ReactNode } from 'react'
import styled from 'styled-components'

type LoadingRowsStyleProps = {
  $height?: string
  $margin?: string
  $padding?: string
  $borderRadius?: string
  $fromColor?: string
  $toColor?: string
}
const StyledLoadingRows = styled.div<LoadingRowsStyleProps>`
  display: grid;
  gap: 0.6rem;

  & > div {
    ${setAnimation(bgPositionAnimation, {
      name: 'bgPositionAnimation',
      duration: 1.5,
      count: 'infinite',
      fillMode: 'both',
    })}
    background: linear-gradient(
      to left,
      ${({ $fromColor = '#5e3f8391' }) => $fromColor} 25%,
      ${({ theme, $toColor = theme.offblackOpaqueMost }) => $toColor} 50%,
      ${({ $fromColor = '#5e3f8391' }) => $fromColor} 75%
      );
    background-size: 400%;
    ${({ $borderRadius }) => $borderRadius && `border-radius: ${$borderRadius}`};
    height: ${({ $height = '2em' }) => $height};
    ${({ $padding }) => $padding && `padding: ${$padding}`};
    ${({ $margin }) => $margin && `margin: ${$margin}`};
    will-change: background-position;
  }
`

function LoadingRows({
  component = <div />,
  rows,
  ...rest
}: { component?: ReactNode; rows: number } & LoadingRowsStyleProps) {
  const arr = Array.from({ length: rows })

  return (
    <StyledLoadingRows {...rest}>
      {arr.map((_, i) => (
        <Fragment key={i}>{component}</Fragment>
      ))}
    </StyledLoadingRows>
  )
}

export default LoadingRows
