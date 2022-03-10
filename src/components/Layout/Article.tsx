import styled from 'styled-components/macro'
import { fadeInAnimation } from 'pages/SingleItem/styleds'
import portugalBg from 'assets/images/portugal-bg.jpg'

export const ArticleFadeInContainer = styled.article`
  overflow: hidden;
  filter: contrast(1) blur(0px);

  background-image: url(${portugalBg});
  background-size: contain;

  ${fadeInAnimation};

  animation-name: fadeIn;
  animation-duration: 0.8s;
`
