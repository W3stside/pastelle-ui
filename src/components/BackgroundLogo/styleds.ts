import styled from 'styled-components/macro'

export const LogoContainer = styled.div<{ isHeader: boolean }>`
  position: absolute;
  height: 100%;
  width: 100%;

  overflow: hidden;

  z-index: -1;

  > picture {
    width: 100%;
    height: 100%;

    > img {
      ${({ isHeader }) => (isHeader ? 'min-height: 100%;' : 'min-width: 100%;')}
      //   min-height: 100%;
      //   width: calc(100% * 791 / 50);
      z-index: -1;
    }
  }
`
