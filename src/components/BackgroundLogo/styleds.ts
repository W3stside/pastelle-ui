import styled from 'styled-components/macro'
import { ThemeModes } from 'theme'

export const LogoContainer = styled.div<{ isHeader: boolean }>`
  position: absolute;
  height: 100%;
  width: 100%;

  overflow: hidden;

  z-index: -1;

  > picture {
    width: 100%;
    height: 100%;

    ${({ theme: { mode } }) =>
      mode === ThemeModes.DARK && 'filter: invert(0) hue-rotate(180deg) contrast(1.5) saturate(2) brightness(0.8);'}

    > img {
      ${({ isHeader }) => (isHeader ? 'min-height: 100%;' : 'min-width: 100%;')}
      z-index: -1;
    }
  }
`
