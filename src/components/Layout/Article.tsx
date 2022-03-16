import styled from 'styled-components/macro'
import { fadeInAnimation } from 'pages/SingleItem/styleds'

const portugalBg =
  process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT +
  '/portugal-bg_Rqj8jTKhFmds.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1647443573520'

export const ArticleFadeInContainer = styled.article`
  overflow: hidden;
  filter: contrast(1) blur(0px);

  background-image: url(${portugalBg});
  background-size: contain;

  ${fadeInAnimation};

  animation-name: fadeIn;
  animation-duration: 0.8s;
`
