import { ArticleFadeIn, Button as ButtonPrimaryUnstyled } from '@past3lle/components'
import { Z_INDEXES } from '@/constants/config'

import { setBackgroundWithDPI } from '@past3lle/theme'
import { transparentize } from 'polished'
import styled from 'styled-components'
import { NOT_FOUND_SET } from './constants'

export const ButtonPrimary = styled(ButtonPrimaryUnstyled)``
export const BackgroundWrapper = styled(ArticleFadeIn)`
  ${({ theme }) =>
    setBackgroundWithDPI(theme, NOT_FOUND_SET, {
      dpiLevel: '1x',
      backgroundAttributes: ['100% 0px/cover no-repeat'],
    })}
`
export const ContainerDiv = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 0rem 5rem 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  background-color: ${({ theme }) => transparentize(0.2, theme.black)};

  ${ButtonPrimary} {
    width: auto;
    padding: 9px;
    margin: 2rem;
    background-color: #8a58ffcc;
  }

  img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: ${Z_INDEXES.BEHIND};
  }
  h2 {
    font-size: 1.6rem;
    text-align: center;
  }
`
