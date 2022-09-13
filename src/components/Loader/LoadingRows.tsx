import styled from 'styled-components/macro'
import { loadingAnimation, setAnimation } from 'theme/styles/animations'

type LoadingRowsStyleProps = { $height?: string; $margin?: string; $padding?: string }
const StyledLoadingRows = styled.div<LoadingRowsStyleProps>`
  display: grid;
  gap: 6px;

  & > div {
    ${setAnimation(loadingAnimation, { duration: 1.5, count: 'infinite', fillMode: 'both' })}
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
