import styled from 'styled-components/macro'
import { fadeInAnimation } from 'pages/SingleItem/styleds'

export const ArticleFadeInContainer = styled.article`
  overflow: hidden;
  filter: contrast(1) blur(0px);

  ${fadeInAnimation};

  animation-name: fadeIn;
  animation-duration: 0.8s;
`
