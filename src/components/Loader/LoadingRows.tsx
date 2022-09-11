import styled, { keyframes } from 'styled-components/macro'

export const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`
type LoadingRowsStyleProps = { $height?: string; $margin?: string; $padding?: string }
const StyledLoadingRows = styled.div<LoadingRowsStyleProps>`
  display: grid;
  gap: 6px;

  & > div {
    animation: ${loadingAnimation} 1.5s infinite;
    animation-fill-mode: both;
    background: linear-gradient(
      to left,
      ${({ theme }) => theme.white} 25%,
      ${({ theme }) => theme.black} 50%,
      ${({ theme }) => theme.white} 75%
    );
    background-size: 400%;
    height: ${({ $height = '2em' }) => $height};
    ${({ $padding }) => $padding && `padding: ${$padding}`};
    ${({ $margin }) => $margin && `margin: ${$margin}`};
    will-change: background-position;
  }
`

function LoadingRows({ rows, ...rest }: { rows: number } & LoadingRowsStyleProps) {
  const arr = Array.from({ length: rows })

  return (
    <StyledLoadingRows {...rest}>
      {arr.map((_, i) => (
        <div key={i} />
      ))}
    </StyledLoadingRows>
  )
}

export default LoadingRows
