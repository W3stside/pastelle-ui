import styled, { keyframes } from 'styled-components/macro'

export const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledLoadingRows = styled.div`
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
    height: 2em;
    will-change: background-position;
  }
`

function LoadingRows({ rows }: { rows: number }) {
  const arr = Array.from({ length: rows })

  return (
    <StyledLoadingRows>
      {arr.map((_, i) => (
        <div key={i} />
      ))}
    </StyledLoadingRows>
  )
}

export default LoadingRows
